import { BuildCardSection } from "../../../ui/build-card-section"
import { StatsContent } from "./stats-content"

/** Card with the calculated stats of the current build. */
export function StatsSection() {
  return (
    <BuildCardSection>
      <StatsContent />
    </BuildCardSection>
  )
}
