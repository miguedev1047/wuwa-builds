import { BuildCanvasCard } from "@builder/components/build-canvas/build-canvas-card"
import { SkillsPreview } from "@builder/components/build-canvas/skills-panel/skills-preview"

/** Read-only panel with the resonator skills and passives preview. */
export function SkillsPanel() {
  return (
    <BuildCanvasCard area="skills">
      <SkillsPreview />
    </BuildCanvasCard>
  )
}
