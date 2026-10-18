import * as React from "react"

// The live homepage below the old hero, split out of station.solutions by
// scripts/extract-legacy.mjs. Rendered as-is so the new hero can be judged in
// the real page, with the site's own CSS (src/legacy/v5.css) and scripts.
import siteNav from "@/legacy/site-nav.html?raw"
import router from "@/legacy/router.html?raw"
import homeBody from "@/legacy/home-body.html?raw"
import guardJs from "@/legacy/mockup-guard.js?raw"
import dataJs from "@/legacy/home-data.js?raw"
import v5Js from "@/legacy/v5.js?raw"
import quizJs from "@/legacy/quiz.js?raw"

// The site's scripts expect to run once per page load.
let scriptsRan = false

function runScripts() {
  if (scriptsRan) return
  scriptsRan = true
  // order matters: the guard first, then the data v5.js reads, then the site scripts
  for (const code of [guardJs, dataJs, v5Js, quizJs]) {
    const s = document.createElement("script")
    s.text = code
    document.body.appendChild(s)
  }
}

export function LegacyHome() {
  React.useEffect(() => {
    runScripts()
  }, [])

  return (
    <>
      {/* the old nav stays in the DOM (hidden) because v5.js wires the cart and search to it */}
      <div hidden dangerouslySetInnerHTML={{ __html: siteNav }} />
      <div className="legacy-router-band">
        <p className="legacy-router-kicker">Pick what hurts</p>
        <div dangerouslySetInnerHTML={{ __html: router }} />
      </div>
      <main id="main" dangerouslySetInnerHTML={{ __html: homeBody }} />
    </>
  )
}
