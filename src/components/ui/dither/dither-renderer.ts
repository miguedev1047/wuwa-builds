import type { DitherColor, DitherSettings } from "@/components/ui/dither/dither"
import {
  DITHER_FRAGMENT,
  MAX_PALETTE,
  MAX_RIPPLES,
  MAX_TRAIL,
  VERTEX,
  WAVE_FRAGMENT,
} from "@/components/ui/dither/dither-shaders"

export type TrailPoint = { x: number; y: number; weight: number }
export type Ripple = { x: number; y: number; age: number }

type Program = {
  program: WebGLProgram
  uniforms: Record<string, WebGLUniformLocation | null>
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
  gl.deleteShader(shader)
  return null
}

const link = (
  gl: WebGL2RenderingContext,
  fragmentSource: string
): Program | null => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) {
    if (vertex) gl.deleteShader(vertex)
    if (fragment) gl.deleteShader(fragment)
    if (program) gl.deleteProgram(program)
    return null
  }
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.bindAttribLocation(program, 0, "aPosition")
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }
  const uniforms: Record<string, WebGLUniformLocation | null> = {}
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i)
    if (info)
      uniforms[info.name.replace("[0]", "")] = gl.getUniformLocation(
        program,
        info.name
      )
  }
  return { program, uniforms }
}

const toLinear = (value: number) =>
  value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)

/** Allocates and draws the wave field and dithering passes. */
export function createDitherRenderer(
  canvas: HTMLCanvasElement,
  gl: WebGL2RenderingContext
) {
  const wave = link(gl, WAVE_FRAGMENT)
  const dither = link(gl, DITHER_FRAGMENT)
  if (!wave || !dither) {
    if (wave) gl.deleteProgram(wave.program)
    if (dither) gl.deleteProgram(dither.program)
    return null
  }

  const buffer = gl.createBuffer()
  const vao = gl.createVertexArray()
  const field = gl.createTexture()
  const framebuffer = gl.createFramebuffer()
  const dispose = () => {
    gl.deleteProgram(wave.program)
    gl.deleteProgram(dither.program)
    gl.deleteBuffer(buffer)
    gl.deleteVertexArray(vao)
    gl.deleteTexture(field)
    gl.deleteFramebuffer(framebuffer)
  }
  if (!buffer || !vao || !field || !framebuffer) {
    dispose()
    return null
  }

  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  )
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  gl.bindTexture(gl.TEXTURE_2D, field)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const probe = document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true })
  const cache = new Map<string, number[]>()
  const toColor = (value: DitherColor): number[] => {
    if (Array.isArray(value))
      return [0, 1, 2].map((i) => clamp(Number(value[i]) || 0, 0, 1))
    const key = String(value)
    const cached = cache.get(key)
    if (cached) return cached
    let rgb = [0, 0, 0]
    if (probe) {
      probe.clearRect(0, 0, 1, 1)
      probe.fillStyle = "#000000"
      probe.fillStyle = key
      probe.fillRect(0, 0, 1, 1)
      const [r, g, b] = probe.getImageData(0, 0, 1, 1).data
      rgb = [r, g, b].map((channel) => toLinear(channel / 255))
    }
    cache.set(key, rgb)
    return rgb
  }

  const view = {
    width: 1,
    height: 1,
    ratio: 1,
    cell: 1,
    cellCss: 1,
    cols: 1,
    rows: 1,
  }
  const trailData = new Float32Array(MAX_TRAIL * 3)
  const rippleData = new Float32Array(MAX_RIPPLES * 4)
  const paletteData = new Float32Array(MAX_PALETTE * 3)

  const allocate = (cell: number) => {
    view.cell = cell
    view.cellCss = view.cell / view.ratio
    view.cols = Math.max(1, Math.ceil(canvas.width / view.cell))
    view.rows = Math.max(1, Math.ceil(canvas.height / view.cell))
    gl.bindTexture(gl.TEXTURE_2D, field)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      view.cols,
      view.rows,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    )
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      field,
      0
    )
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  const resize = (
    width: number,
    height: number,
    ratio: number,
    pixelSize: number
  ) => {
    view.width = width
    view.height = height
    canvas.width = Math.max(1, Math.round(width * ratio))
    canvas.height = Math.max(1, Math.round(height * ratio))
    view.ratio = canvas.width / width
    allocate(Math.max(1, Math.round(pixelSize * view.ratio)))
  }

  const render = (
    s: DitherSettings,
    time: number,
    reveal: number,
    trailPoints: TrailPoint[],
    ripples: Ripple[]
  ) => {
    const expected = Math.max(1, Math.round(s.pixelSize * view.ratio))
    if (expected !== view.cell) allocate(expected)

    let trailCount = 0
    for (let i = 0; i < trailPoints.length && trailCount < MAX_TRAIL; i++) {
      const point = trailPoints[i]
      if (point.weight <= 0.01) continue
      trailData.set([point.x, point.y, point.weight], trailCount * 3)
      trailCount++
    }
    let rippleCount = 0
    for (let i = ripples.length - 1; i >= 0 && rippleCount < MAX_RIPPLES; i--) {
      rippleData.set(
        [ripples[i].x, ripples[i].y, ripples[i].age, 1],
        rippleCount * 4
      )
      rippleCount++
    }

    const eased = reveal * reveal * (3 - 2 * reveal)

    gl.bindVertexArray(vao)
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.viewport(0, 0, view.cols, view.rows)
    gl.useProgram(wave.program)
    const w = wave.uniforms
    gl.uniform2f(
      w.uResolution,
      canvas.width / view.ratio,
      canvas.height / view.ratio
    )
    gl.uniform1f(w.uCell, view.cellCss)
    gl.uniform1f(w.uTime, time)
    gl.uniform1f(w.uWaveSpeed, s.waveSpeed)
    gl.uniform1f(w.uWaveFrequency, s.waveFrequency)
    gl.uniform1f(w.uWaveAmplitude, s.waveAmplitude)
    gl.uniform1f(w.uScale, s.scale)
    gl.uniform1f(w.uContrast, s.contrast)
    gl.uniform1f(w.uBrightness, s.brightness)
    gl.uniform1i(w.uEffect, s.effect)
    gl.uniform1f(w.uRadius, s.mouseRadius)
    gl.uniform1f(w.uStrength, s.mouseStrength)
    gl.uniform3fv(w.uTrail, trailData)
    gl.uniform1i(w.uTrailCount, trailCount)
    gl.uniform4fv(w.uRipples, rippleData)
    gl.uniform1i(w.uRippleCount, rippleCount)
    gl.uniform1f(w.uIntro, eased)
    gl.uniform1f(w.uReach, 0.5 * Math.hypot(view.width / view.height, 1) + 0.45)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.useProgram(dither.program)
    const d = dither.uniforms
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, field)
    gl.uniform1i(d.uField, 0)
    gl.uniform2i(d.uFieldSize, view.cols, view.rows)
    gl.uniform1f(d.uCellDevice, view.cell)
    gl.uniform1i(d.uMode, s.mode)
    gl.uniform1f(d.uColorNum, s.colorNum)
    gl.uniform3fv(d.uWave, toColor(s.waveColor))
    const transparent = s.backgroundColor === "transparent"
    gl.uniform3fv(
      d.uBackground,
      transparent ? [0, 0, 0] : toColor(s.backgroundColor)
    )
    gl.uniform1f(d.uTransparent, transparent ? 1 : 0)
    s.palette.forEach((value, index) =>
      paletteData.set(toColor(value), index * 3)
    )
    gl.uniform3fv(d.uPalette, paletteData)
    gl.uniform1i(d.uPaletteCount, s.palette.length)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  return { render, resize, dispose }
}
