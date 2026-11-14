/**
 * Areas of the build canvas grid.
 *
 * The grid template lives in `.build-canvas` (`src/styles.css`); this list only
 * keeps the `data-canvas-area` values typed, so a typo fails the typecheck.
 */
export const BUILD_CANVAS_AREAS = [
  "resonator",
  "stats",
  "sequencies",
  "skills",
  "weapon",
  "echoes",
] as const

export type BuildCanvasArea = (typeof BUILD_CANVAS_AREAS)[number]
