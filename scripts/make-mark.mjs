// Renders Station's real pinwheel mark (the SVG from the live site's nav) to large
// transparent PNGs the hero can rebuild out of particles. Light and dark ink.
//   node scripts/make-mark.mjs
import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

const out = path.resolve(import.meta.dirname, "..", "src", "assets", "station-mark")
fs.mkdirSync(out, { recursive: true })

// Wide canvas (2.2 : 1) so the mark sits in the band like the sculpture does,
// with room either side; the mark itself is the site's 100 x 100 drawing.
const W = 2200
const H = 1000
const S = 900 // mark size in px

const mark = (fill) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <g id="arm"><rect x="29.5" y="3" width="18" height="36" rx="8.5"/><rect x="52.5" y="3" width="18" height="36" rx="8.5"/></g>
    <mask id="core" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
      <rect width="100" height="100" fill="#fff"/><circle cx="50" cy="50" r="16.5" fill="#000"/>
    </mask>
  </defs>
  <g transform="translate(${(W - S) / 2} ${(H - S) / 2}) scale(${S / 100})">
    <g mask="url(#core)" fill="${fill}" transform="rotate(45 50 50)">
      <use href="#arm"/><use href="#arm" transform="rotate(90 50 50)"/>
      <use href="#arm" transform="rotate(180 50 50)"/><use href="#arm" transform="rotate(270 50 50)"/>
    </g>
  </g>
</svg>`

for (const [name, fill] of [["light", "#1D1D1F"], ["dark", "#F1EFEA"]]) {
  const file = path.join(out, `station-mark-${name}.png`)
  await sharp(Buffer.from(mark(fill))).png({ compressionLevel: 9 }).toFile(file)
  console.log("wrote", path.relative(process.cwd(), file), fs.statSync(file).size, "B")
}
