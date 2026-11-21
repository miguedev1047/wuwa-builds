import "@home/presentation/landing/styles/hero-section.css"
import { builderPreview, type LandingBackground } from "@/assets/landing"
import { Button } from "@/components/panelui/button"
import { Safari } from "@/components/ui/safari"
import { Link } from "@tanstack/react-router"
import { HeroBackground } from "@home/presentation/landing/components/hero-background"

type HeroSectionProps = {
  /** Responsive dithered images for the selected hero background. */
  background: LandingBackground
}

/** Introduces the builder and shows its preview. */
export function HeroSection({ background }: HeroSectionProps) {
  return (
    <section id="hero-section" aria-labelledby="hero-title">
      <HeroBackground background={background} />
      <div className="relative z-10 mx-auto max-w-7xl space-y-20 px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          <h1
            id="hero-title"
            className="hero-enter-title text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"
          >
            Tu build,{" "}
            <span className="bg-linear-to-r from-foreground via-primary to-highlight bg-clip-text text-transparent">
              calculada antes de farmear.
            </span>
          </h1>
          <p className="hero-enter-copy mx-auto max-w-2xl text-base text-pretty text-foreground/80 sm:text-lg">
            Elige resonador, arma y ecos. Ajusta niveles y substats y mira tus
            estadísticas al instante.
          </p>
          <Button
            nativeButton={false}
            render={<Link to="/panel/my-builds" />}
            className="hero-enter-action"
          >
            Mis builds
          </Button>
        </div>
        <div className="hero-enter-preview">
          <Safari url="wuwa-builds.dev" imageSrc={builderPreview} />
        </div>
      </div>
    </section>
  )
}
