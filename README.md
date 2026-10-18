# Station hero mockup

**See it:** https://stationonemain-source.github.io/station-hero-mockup/ (noindex preview, served from the `gh-pages` branch)

A mockup of station.solutions with the liquid sculpture hero on top of the real
homepage. **Not live** and not connected to anything: the old homepage's forms,
cart and tracking are blocked by `src/legacy/mockup-guard.js`.

Stack: Vite + React + TypeScript + Tailwind v4 + shadcn (`components.json`, components in
`src/components/ui`).

- `src/components/ui/liquid-sculpture-hero.tsx` — the hero component (WebGL2 particles)
- `src/components/station/station-hero.tsx` — Station's copy, colours and the two materials
  (the sculpture, or the Station pinwheel mark)
- `src/components/station/legacy-home.tsx` — the live homepage below the hero, as it is today
- `src/legacy/` — the live site's `v5.css`, `v5.js`, `quiz.js`, and the homepage split up by
  `scripts/extract-legacy.mjs` (refresh `_source-index.html` from station-nightshift `main`, then re-run it)
- `scripts/make-mark.mjs` — renders the pinwheel from the site's own SVG to PNG
- `scripts/share-inline.mjs` — turns the share build into one self-contained HTML page

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run share    # one-file page in dist-share/ (+ dist-share/pages/index.html for GitHub Pages)
```

Update the preview: `npm run share`, then commit `dist-share/pages/index.html` and `.nojekyll` to the `gh-pages` branch.

Notes
- Tailwind runs without Preflight and the live CSS sits in its own cascade layer
  (`src/index.css`), so the old sections look exactly as they do on the site.
- `src/lib/utils.ts` uses clsx + tailwind-merge: the `cn` package shadcn installs breaks in
  Vite 8 production builds (its packed tables come out as U+FFFD).
