import { BuildCanvasCard } from "@builder/components/build-canvas/build-canvas-card"

/** Card with the calculated stats of the current build. */
export function StatsPanel({ children }: { children: React.ReactNode }) {
  return <BuildCanvasCard area="stats">{children}</BuildCanvasCard>
}
