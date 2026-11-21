import { cn } from "cn"
import { useEffect, useRef, type CSSProperties } from "react"
import { mountDither } from "@/components/ui/dither/dither-runtime"
import { MAX_PALETTE } from "@/components/ui/dither/dither-shaders"

export type DitherColor = string | [number, number, number]
export type DitherMode =
  | "bayer"
  | "bayer4"
  | "bayer2"
  | "halftone"
  | "lines"
  | "crosshatch"
  | "noise"
  | "none"
export type DitherMouseEffect = "erase" | "reveal" | "ripple"

export interface DitherProps {
  /** Speed of the wave animation. */
  waveSpeed?: number
  /** Frequency multiplier between noise layers. */
  waveFrequency?: number
  /** Amplitude multiplier between noise layers. */
  waveAmplitude?: number
  /** Wave color in CSS or linear RGB. */
  waveColor?: DitherColor
  /** Base color in CSS or linear RGB, or transparent. */
  backgroundColor?: DitherColor
  /** Shades available per color channel. */
  colorNum?: number
  /** Pixel size of each dither cell in CSS pixels. */
  pixelSize?: number
  /** Freezes the underlying wave animation. */
  disableAnimation?: boolean
  /** Enables the pointer trail. */
  enableMouseInteraction?: boolean
  /** Radius of the pointer effect. */
  mouseRadius?: number
  /** Pattern used to quantize the wave field. */
  ditherMode?: DitherMode
  /** Indexed colors from dark to light, overriding the two base colors. */
  palette?: string[]
  /** Size of the wave pattern. */
  scale?: number
  /** Contrast of the wave field before dithering. */
  contrast?: number
  /** Brightness offset before dithering. */
  brightness?: number
  /** How the pointer affects the wave field. */
  mouseEffect?: DitherMouseEffect
  /** Intensity of the pointer effect. */
  mouseStrength?: number
  /** Persistence of the pointer trail. */
  trail?: number
  /** Enables ripples when the user presses the background. */
  clickRipple?: boolean
  /** Reveals the wave field on mount. */
  intro?: boolean
  /** Maximum device pixel ratio, capped at two. */
  dpr?: number
  /** Extra classes for the canvas container. */
  className?: string
  /** Inline styles for the canvas container. */
  style?: CSSProperties
}

export type DitherSettings = {
  waveSpeed: number
  waveFrequency: number
  waveAmplitude: number
  waveColor: DitherColor
  backgroundColor: DitherColor
  colorNum: number
  pixelSize: number
  disableAnimation: boolean
  enableMouseInteraction: boolean
  mouseRadius: number
  mode: number
  palette: string[]
  scale: number
  contrast: number
  brightness: number
  effect: number
  mouseStrength: number
  trail: number
  clickRipple: boolean
  intro: boolean
  dpr?: number
}

const MODES: Record<string, number> = {
  bayer: 0,
  bayer4: 1,
  bayer2: 2,
  halftone: 3,
  lines: 4,
  crosshatch: 5,
  noise: 6,
  none: 7,
}
const EFFECTS: Record<string, number> = { erase: 0, reveal: 1, ripple: 2 }

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/** Renders the React Bits dithered wave shader into a decorative canvas. */
export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  backgroundColor = [0, 0, 0],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
  ditherMode = "bayer",
  palette,
  scale = 1,
  contrast = 1,
  brightness = 0,
  mouseEffect = "erase",
  mouseStrength = 1,
  trail = 0.5,
  clickRipple = true,
  intro = true,
  dpr,
  className = "",
  style,
}: DitherProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wakeRef = useRef<(() => void) | null>(null)
  const settings: DitherSettings = {
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    waveColor,
    backgroundColor,
    colorNum: Math.max(2, colorNum),
    pixelSize: Math.max(1, pixelSize),
    disableAnimation,
    enableMouseInteraction,
    mouseRadius: Math.max(0.001, mouseRadius),
    mode: MODES[ditherMode] ?? 0,
    palette: Array.isArray(palette)
      ? palette.filter(Boolean).slice(0, MAX_PALETTE)
      : [],
    scale: Math.max(0.05, scale),
    contrast,
    brightness,
    effect: EFFECTS[mouseEffect] ?? 0,
    mouseStrength: Math.max(0, mouseStrength),
    trail: clamp(trail, 0, 1),
    clickRipple,
    intro,
    dpr,
  }

  const settingsRef = useRef(settings)

  useEffect(() => {
    settingsRef.current = settings
    wakeRef.current?.()
  })

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const runtime = mountDither(container, canvas, () => settingsRef.current)
    if (!runtime) return

    wakeRef.current = runtime.update
    return () => {
      wakeRef.current = null
      runtime.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
        aria-hidden="true"
      />
    </div>
  )
}
