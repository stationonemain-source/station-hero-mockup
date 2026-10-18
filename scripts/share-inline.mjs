// Turns dist-share/index.html into one page that needs nothing from the network
// except Google Fonts: every /media/... image the live site's sections use is
// inlined as a data: URI, and the document wrapper is dropped so it can be
// published as a private preview page.   node scripts/share-inline.mjs
import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const inFile = path.join(root, "dist-share", "index.html")
const outFile = path.join(root, "dist-share", "station-hero-mockup.html")
let html = fs.readFileSync(inFile, "utf8")

const MIME = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", svg: "image/svg+xml", webp: "image/webp" }
const seen = new Map()
const missing = new Set()
html = html.replace(/\/media\/[A-Za-z0-9_\-/.]+\.(jpg|jpeg|png|svg|webp)/g, (ref, ext) => {
  if (seen.has(ref)) return seen.get(ref)
  const file = path.join(root, "public", ref)
  if (!fs.existsSync(file)) {
    missing.add(ref)
    return ref
  }
  const uri = `data:${MIME[ext.toLowerCase()]};base64,${fs.readFileSync(file).toString("base64")}`
  seen.set(ref, uri)
  return uri
})

// The preview host wraps the page in its own document: keep the head's tags,
// drop <!doctype>, <html>, <head> and <body> themselves.
const head = (html.match(/<head>([\s\S]*?)<\/head>/) || [, ""])[1]
const body = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/) || [, html])[1]
const title = (head.match(/<title>[\s\S]*?<\/title>/) || ["<title>Station Hero Mockup</title>"])[0]
const headRest = head
  .replace(/<title>[\s\S]*?<\/title>/, "")
  .replace(/<meta charset[^>]*>/i, "")
  .replace(/<meta name="viewport"[^>]*>/i, "")
// v5.js also builds some image paths at run time ("/media/logos/" + name + ".svg"),
// which no text replacement can reach: map every logo and swap the src as the
// element appears.
const logoDir = path.join(root, "public", "media", "logos")
const logos = Object.fromEntries(
  fs.readdirSync(logoDir).map((f) => [
    "/media/logos/" + f,
    "data:image/svg+xml;base64," + fs.readFileSync(path.join(logoDir, f)).toString("base64"),
  ])
)
const runtimeMedia = `<script>(function(){var M=${JSON.stringify(logos)};
function fix(el){var s=el.getAttribute&&el.getAttribute("src");if(s&&M[s])el.setAttribute("src",M[s]);}
new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==="attributes")fix(m.target);
m.addedNodes&&m.addedNodes.forEach(function(n){if(n.nodeType===1){fix(n);n.querySelectorAll&&n.querySelectorAll('img[src^="/media/"]').forEach(fix);}});});})
.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["src"]});})()</script>`

// charset stays: the bundle holds non-ASCII data tables, and a host that serves the
// file without a charset header would otherwise decode it as Windows-1252 and break it
const page =
  `<meta charset="utf-8">\n${title}\n<meta name="claude:viewport-fit-sides" content="cover">\n` +
  // the live site adds class="js" on <html>; its CSS keys a few reveals off it
  `<script>document.documentElement.classList.add("js")</script>\n` +
  runtimeMedia + "\n" +
  `${headRest}\n${body}\n`
fs.writeFileSync(outFile, page)
console.log(
  "inlined %d images · missing %d%s · %s KB",
  seen.size, missing.size, missing.size ? " (" + [...missing].join(", ") + ")" : "",
  Math.round(fs.statSync(outFile).size / 1024)
)
