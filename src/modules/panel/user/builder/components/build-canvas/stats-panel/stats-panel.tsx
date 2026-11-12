import { BuildCanvasCard } from "@builder/components/build-canvas/build-canvas-card"
import { StatsContent } from "@builder/components/build-canvas/stats-panel/stats-content"

/** Card with the calculated stats of the current build. */
export function StatsPanel() {
  return (
    <BuildCanvasCard area="stats">
      <StatsContent />
    </BuildCanvasCard>
  )
}
