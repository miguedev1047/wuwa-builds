import type { LandingBackground } from "@/assets/landing"
import { HeroSection } from "@/modules/home/presentation/landing/sections/hero-section"

type LandingPageProps = {
  /** Responsive background selected by the landing route. */
  background: LandingBackground
}

/** Public introduction to the Wuthering Waves build editor. */
export function LandingPage({ background }: LandingPageProps) {
  return (
    <main id="inicio" className="relative space-y-20">
      <HeroSection background={background} />
    </main>
  )
}
