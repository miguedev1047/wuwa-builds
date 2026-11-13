import { BuildCanvasCard } from "@builder/components/build-canvas/build-canvas-card"

/** Read-only panel with the resonator skills and passives preview. */
export function SkillsPanel({ children }: { children: React.ReactNode }) {
  return <BuildCanvasCard area="skills">{children}</BuildCanvasCard>
}
