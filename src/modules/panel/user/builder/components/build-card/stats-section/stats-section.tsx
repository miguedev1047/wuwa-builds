import { BuildCardSection } from "@builder/ui/build-card-section"
import { StatsContent } from "@builder/components/build-card/stats-section/stats-content"

/** Card with the calculated stats of the current build. */
export function StatsSection() {
  return (
    <BuildCardSection>
      <StatsContent />
    </BuildCardSection>
  )
}
