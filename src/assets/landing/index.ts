import blackShoreMobile from "./backgrounds/black-shore/mobile.webp"
import blackShoreTablet from "./backgrounds/black-shore/tablet.webp"
import blackShoreDesktop from "./backgrounds/black-shore/desktop.webp"
import rinascittaMobile from "./backgrounds/rinascitta/mobile.webp"
import rinascittaTablet from "./backgrounds/rinascitta/tablet.webp"
import rinascittaDesktop from "./backgrounds/rinascitta/desktop.webp"
import sunsetMobile from "./backgrounds/sunset/mobile.webp"
import sunsetTablet from "./backgrounds/sunset/tablet.webp"
import sunsetDesktop from "./backgrounds/sunset/desktop.webp"

export { default as builderPreview } from "./builder-preview.webp"

export type LandingBackground = {
  /** Narrow portrait crop. */
  mobile: string
  /** Medium crop for tablet and laptop viewports. */
  tablet: string
  /** Wide image for large desktop viewports. */
  desktop: string
}

/** Pre-rendered dithered backgrounds for the landing hero. */
export const landingBackgrounds = [
  {
    mobile: blackShoreMobile,
    tablet: blackShoreTablet,
    desktop: blackShoreDesktop,
  },
  {
    mobile: rinascittaMobile,
    tablet: rinascittaTablet,
    desktop: rinascittaDesktop,
  },
  { mobile: sunsetMobile, tablet: sunsetTablet, desktop: sunsetDesktop },
] as const satisfies readonly LandingBackground[]
