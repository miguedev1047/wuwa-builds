import { SkillsPreview } from "@builder/components/build-canvas/skills-panel/skills-preview"
import { BuildCardSection } from "@builder/ui/build-card-section"

/** Read-only panel with the resonator skills and passives preview. */
export function SkillsPanel() {
  return (
    <BuildCardSection>
      <SkillsPreview />
    </BuildCardSection>
  )
}
