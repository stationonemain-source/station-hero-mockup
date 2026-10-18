// Splits the live station.solutions homepage (a copy of origin/main:index.html in
// src/legacy/_source-index.html) into the pieces the mockup renders under the new hero.
// Re-run after refreshing _source-index.html:  node scripts/extract-legacy.mjs
import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const legacy = path.join(root, "src", "legacy")
const html = fs.readFileSync(path.join(legacy, "_source-index.html"), "utf8")
const SITE = "https://station.solutions"

function slice(from, to, { includeTo = false } = {}) {
  const a = html.indexOf(from)
  if (a < 0) throw new Error("start marker not found: " + from)
  const b = html.indexOf(to, a)
  if (b < 0) throw new Error("end marker not found: " + to)
  return html.slice(a, includeTo ? b + to.length : b)
}

// Links point at the real site, so clicking around the mockup opens real pages.
// Images keep their /media paths and are served from public/media.
const absolutize = (s) =>
  s.replace(/(href|action)="\/(?!\/)/g, `$1="${SITE}/`)

// 1. The site's own nav. Hidden in the mockup (the hero brings its own), but kept in the
//    DOM because v5.js wires the cart, search and mobile menu to it.
const siteNav = slice('<nav class="nav">', '<main id="main">')

// 2. The "pick what hurts" router that sat inside the old hero.
const router = slice('<nav class="hf-router"', "</nav>", { includeTo: true })

// 3. Everything after the old hero, through the footer.
let body = slice('<section id="sweep-band"', "</footer>", { includeTo: true })

// Inline data scripts (STATION_FAQ, STATION_CATALOG) run before v5.js; script tags are
// stripped from the markup because innerHTML would not run them anyway.
const inline = []
body = body.replace(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g, (_, code) => {
  inline.push(code.trim())
  return ""
})
body = body.replace(/<script[^>]*\bsrc=[^>]*><\/script>/g, "")
// the catalog script sits after </footer> on the live page
const tail = html.slice(html.indexOf("</footer>"))
tail.replace(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g, (_, code) => {
  if (!inline.includes(code.trim())) inline.push(code.trim())
  return ""
})

fs.writeFileSync(path.join(legacy, "site-nav.html"), absolutize(siteNav))
fs.writeFileSync(path.join(legacy, "router.html"), absolutize(router))
fs.writeFileSync(path.join(legacy, "home-body.html"), absolutize(body))
fs.writeFileSync(path.join(legacy, "home-data.js"), inline.join(";\n") + ";\n")
console.log(
  "site-nav %d B · router %d B · body %d B · %d inline data scripts",
  siteNav.length, router.length, body.length, inline.length
)
