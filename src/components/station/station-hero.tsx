import SculptureHero from "@/components/ui/liquid-sculpture-hero"

import sculptureLight from "@/assets/sculpture/sculpture-light.webp"
import sculptureDark from "@/assets/sculpture/sculpture-dark.webp"
import sculptureMobileLight from "@/assets/sculpture/sculpture-mobile-light.webp"
import sculptureMobileDark from "@/assets/sculpture/sculpture-mobile-dark.webp"
import markLight from "@/assets/station-mark/station-mark-light.png"
import markDark from "@/assets/station-mark/station-mark-dark.png"

export type HeroArt = "sculpture" | "mark"

const SITE = "https://station.solutions"

// Station's real palette (station.solutions v5 tokens). Text colour is left to the
// component so it flips with its light/dark switch; the gold accent reads on both
// grounds (5.4:1 on paper, 3.2:1 on the dark ground, display size).
const PAPER = "#F5F4F1"
const GOLD = "#8A5A00"

const ART = {
  sculpture: {
    src: sculptureLight,
    darkSrc: sculptureDark,
    mobileSrc: sculptureMobileLight,
    mobileDarkSrc: sculptureMobileDark,
    imageAlt: "Abstract sculpture of interwoven metallic filaments and particles",
  },
  mark: {
    src: markLight,
    darkSrc: markDark,
    mobileSrc: markLight,
    mobileDarkSrc: markDark,
    imageAlt: "The Station pinwheel mark",
  },
} as const

export function StationHero({ art, height }: { art: HeroArt; height?: string }) {
  return (
    <SculptureHero
      key={art}
      {...ART[art]}
      height={height}
      brand="Station"
      navLinks={[
        { label: "Phone & leads", href: `${SITE}/frontdesk/` },
        { label: "Websites & Google", href: `${SITE}/storefront/` },
        { label: "Bundles", href: "#bundles" },
        { label: "Free audit", href: `${SITE}/audit/` },
      ]}
      navCta={{ label: "Find my fit", href: "#help" }}
      // copy is the live homepage's own words
      eyebrow="Welcome to Station"
      headline={"The best way to staff\nyour front office."}
      headlineAccent="front office."
      body="Thirteen products and a website, sold one at a time or as three collections that work together. Pick what hurts. Live in days."
      primaryCta={{ label: "See your new website — free demo", href: `${SITE}/custom/` }}
      secondaryCta={{ label: "Get a free audit", href: `${SITE}/audit/` }}
      hint="Move across the form"
      hintTouch="Touch the form"
      background={PAPER}
      accentColor={GOLD}
      backdropText="station"
      sculptureScale={art === "mark" ? 0.9 : 1}
      // a touch smaller on phones so the eyebrow above the headline stays readable
      mobileSculptureScale={0.9}
      particleDensity={art === "mark" ? 1.2 : 1}
    />
  )
}
