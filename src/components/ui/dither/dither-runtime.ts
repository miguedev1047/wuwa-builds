import type { DitherSettings } from "@/components/ui/dither/dither"
import {
  createDitherRenderer,
  type Ripple,
  type TrailPoint,
} from "@/components/ui/dither/dither-renderer"
import {
  INTRO_SECONDS,
  MAX_RIPPLES,
  MAX_TRAIL,
  RIPPLE_SECONDS,
} from "@/components/ui/dither/dither-shaders"

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/** Starts the renderer and owns its browser observers, listeners and frame loop. */
export function mountDither(
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  getSettings: () => DitherSettings
) {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  })
  if (!gl) return null

  const renderer = createDitherRenderer(canvas, gl)
  if (!renderer) return null

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
  const pointer = { x: 0, y: 0, inside: false, set: false }
  const trailPoints: TrailPoint[] = []
  const ripples: Ripple[] = []
  const state = {
    time: 0,
    hx: 0,
    hy: 0,
    presence: 0,
    reveal: getSettings().intro && !motion.matches ? 0 : 1,
  }
  let raf = 0
  let last = 0
  let visible = true
  let width = 1
  let height = 1

  const toUv = (x: number, y: number): [number, number] => [
    (x / width - 0.5) * (width / height),
    -(y / height - 0.5),
  ]
  const render = (settings: DitherSettings) => {
    const reveal = settings.intro && !motion.matches ? state.reveal : 1
    renderer.render(settings, state.time, reveal, trailPoints, ripples)
  }

  const frame = (now: number) => {
    raf = 0
    if (!visible || document.hidden) return
    const s = getSettings()
    const dt = last ? clamp((now - last) / 1000, 0.0005, 0.05) : 1 / 60
    last = now
    if (!s.disableAnimation && !motion.matches) state.time += dt

    const engaged =
      s.enableMouseInteraction && pointer.inside && !motion.matches
    state.presence +=
      ((engaged ? 1 : 0) - state.presence) *
      (1 - Math.exp(-dt / (engaged ? 0.12 : 0.35)))
    if (motion.matches) {
      trailPoints.length = 0
      ripples.length = 0
      state.presence = 0
    }
    if (pointer.set && !motion.matches) {
      const [tx, ty] = toUv(pointer.x, pointer.y)
      const follow = 1 - Math.exp(-dt / 0.06)
      const moved = Math.hypot(tx - state.hx, ty - state.hy)
      state.hx += (tx - state.hx) * follow
      state.hy += (ty - state.hy) * follow
      const decay = Math.exp(-dt / (0.08 + s.trail * 0.7))
      trailPoints.forEach((point) => {
        point.weight *= decay
      })
      const head = trailPoints[0]
      if (
        !head ||
        Math.hypot(head.x - state.hx, head.y - state.hy) > 0.012 ||
        moved > 0.012
      ) {
        trailPoints.unshift({
          x: state.hx,
          y: state.hy,
          weight: state.presence,
        })
      } else {
        head.x = state.hx
        head.y = state.hy
        head.weight = state.presence
      }
      if (s.trail <= 0.001) trailPoints.length = Math.min(trailPoints.length, 1)
      while (
        trailPoints.length > MAX_TRAIL ||
        (trailPoints.length > 1 &&
          trailPoints[trailPoints.length - 1].weight < 0.01)
      ) {
        trailPoints.pop()
      }
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].age += dt
      if (ripples[i].age >= RIPPLE_SECONDS) ripples.splice(i, 1)
    }

    if (!s.intro || motion.matches) state.reveal = 1
    else if (state.reveal < 1)
      state.reveal = Math.min(1, state.reveal + dt / INTRO_SECONDS)

    render(s)
    const busy =
      !s.disableAnimation ||
      state.reveal < 1 ||
      ripples.length > 0 ||
      state.presence > 0.002 ||
      trailPoints.some((point) => point.weight > 0.01)
    if (busy && !motion.matches) raf = requestAnimationFrame(frame)
    else last = 0
  }

  const wake = () => {
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame)
  }

  const resize = () => {
    const settings = getSettings()
    width = Math.max(1, container.clientWidth)
    height = Math.max(1, container.clientHeight)
    const ratio = clamp(settings.dpr ?? window.devicePixelRatio ?? 1, 0.5, 2)
    renderer.resize(width, height, ratio, settings.pixelSize)
    render(settings)
    wake()
  }

  const locate = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect()
    pointer.x = event.clientX - rect.left
    pointer.y = event.clientY - rect.top
    pointer.inside =
      pointer.x >= 0 &&
      pointer.y >= 0 &&
      pointer.x <= rect.width &&
      pointer.y <= rect.height
    if (pointer.inside && !pointer.set) {
      const [x, y] = toUv(pointer.x, pointer.y)
      state.hx = x
      state.hy = y
      pointer.set = true
    }
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!getSettings().enableMouseInteraction || motion.matches) return
    locate(event)
    wake()
  }

  const onPointerDown = (event: PointerEvent) => {
    const s = getSettings()
    locate(event)
    if (!pointer.inside || !s.clickRipple || motion.matches) return
    const [x, y] = toUv(pointer.x, pointer.y)
    ripples.push({ x, y, age: 0 })
    if (ripples.length > MAX_RIPPLES) ripples.shift()
    wake()
  }

  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") pointer.inside = false
  }

  const onPointerLeave = () => {
    pointer.inside = false
  }

  const stop = () => {
    cancelAnimationFrame(raf)
    raf = 0
    last = 0
  }
  const onVisibility = () => {
    if (document.hidden) stop()
    else wake()
  }

  motion.addEventListener("change", wake)

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  const intersection = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting)
    if (!visible) stop()
    if (visible) {
      last = 0
      wake()
    }
  })
  intersection.observe(container)
  window.addEventListener("pointermove", onPointerMove, { passive: true })
  window.addEventListener("pointerdown", onPointerDown, { passive: true })
  window.addEventListener("pointerup", onPointerUp, { passive: true })
  window.addEventListener("pointercancel", onPointerUp, { passive: true })
  document.documentElement.addEventListener("pointerleave", onPointerLeave)
  document.addEventListener("visibilitychange", onVisibility)
  resize()

  let lastDpr = getSettings().dpr
  return {
    update: () => {
      const settings = getSettings()
      if (settings.dpr !== lastDpr) {
        lastDpr = settings.dpr
        resize()
        return
      }
      wake()
    },
    dispose: () => {
      stop()
      resizeObserver.disconnect()
      intersection.disconnect()
      motion.removeEventListener("change", wake)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerUp)
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave
      )
      document.removeEventListener("visibilitychange", onVisibility)
      renderer.dispose()
      if (!canvas.isConnected)
        gl.getExtension("WEBGL_lose_context")?.loseContext()
    },
  }
}
