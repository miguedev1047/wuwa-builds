import type { LandingBackground } from "@/assets/landing"

type HeroBackgroundProps = {
  /** Responsive sources for the image selected for this visit. */
  background: LandingBackground
}

/** Draws the selected image behind the landing hero. */
export function HeroBackground({ background }: HeroBackgroundProps) {
  return (
    <picture
      className="pointer-events-none absolute inset-x-0 top-0 z-0 block h-300 w-full mask-y-from-80% opacity-40"
      aria-hidden="true"
    >
      <source media="(width < 40rem)" srcSet={background.mobile} />
      <source media="(width < 80rem)" srcSet={background.tablet} />
      <img
        src={background.desktop}
        alt=""
        loading="eager"
        className="hero-background-image size-full object-cover"
      />
    </picture>
  )
}
