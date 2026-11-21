import Dither from "@/components/ui/dither/dither"

const LOGIN_PALETTE = ["#120f17", "#241d30", "#40344e", "#665872"]

/** Full-page dithered waves behind the Discord sign-in action. */
export function LoginBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Dither
        palette={LOGIN_PALETTE}
        ditherMode="bayer"
        pixelSize={3}
        waveSpeed={0.04}
        waveFrequency={3}
        waveAmplitude={0.3}
        mouseEffect="erase"
        mouseRadius={0.3}
        intro={false}
        dpr={1}
      />
    </div>
  )
}
