import { BuildCardSection } from "@builder/ui/build-card-section"
import { StatsContent } from "@builder/components/build-canvas/stats-panel/stats-content"

/** Card with the calculated stats of the current build. */
export function StatsPanel() {
  return (
    <BuildCardSection>
      <StatsContent />
    </BuildCardSection>
  )
}
