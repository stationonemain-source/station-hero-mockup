import * as React from "react"
import { Shapes, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LegacyHome } from "@/components/station/legacy-home"
import { StationHero, type HeroArt } from "@/components/station/station-hero"

const ART_KEY = "station-hero-mockup:art"

function readArt(): HeroArt {
  try {
    const hash = window.location.hash.replace("#", "")
    if (hash === "mark" || hash === "sculpture") return hash
    const saved = window.localStorage.getItem(ART_KEY)
    if (saved === "mark" || saved === "sculpture") return saved
  } catch {
    /* storage can be blocked; the default is fine */
  }
  return "sculpture"
}

export default function App() {
  const [art, setArt] = React.useState<HeroArt>(readArt)

  const choose = (next: HeroArt) => {
    setArt(next)
    try {
      window.localStorage.setItem(ART_KEY, next)
    } catch {
      /* ignore */
    }
  }

  // the hero fills the screen on the real site; here it fills what the mockup bar leaves
  const barRef = React.useRef<HTMLDivElement>(null)
  React.useLayoutEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const set = () =>
      document.documentElement.style.setProperty("--mockup-bar-h", bar.offsetHeight + "px")
    set()
    const ro = new ResizeObserver(set)
    ro.observe(bar)
    return () => ro.disconnect()
  }, [])

  return (
    <>
      {/* Mockup-only bar: compare the two hero materials. Not part of the site. */}
      <div
        ref={barRef}
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-neutral-900 py-1.5 pr-[max(16px,env(safe-area-inset-right))] pl-[max(16px,env(safe-area-inset-left))] text-[12px] text-neutral-300"
        role="group"
        aria-label="Hero mockup"
      >
        <span className="font-medium tracking-wide uppercase">Mockup · not live</span>
        <div className="flex items-center gap-1">
          {(
            [
              ["sculpture", "Sculpture", Sparkles],
              ["mark", "Station mark", Shapes],
            ] as const
          ).map(([key, label, Icon]) => (
            <Button
              key={key}
              size="sm"
              variant={art === key ? "secondary" : "ghost"}
              className={
                art === key
                  ? "rounded-full"
                  : // bg-transparent: the live site's CSS gives every bare <button> a grey fill
                    "rounded-full bg-transparent text-neutral-300 hover:bg-white/10 hover:text-white"
              }
              aria-pressed={art === key}
              onClick={() => choose(key)}
            >
              <Icon aria-hidden="true" />
              {label}
            </Button>
          ))}
        </div>
      </div>
      <StationHero art={art} height="calc(100svh - var(--mockup-bar-h, 0px))" />
      <LegacyHome />
    </>
  )
}
