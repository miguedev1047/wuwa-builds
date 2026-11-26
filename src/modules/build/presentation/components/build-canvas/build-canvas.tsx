import type { ReactNode } from "react"
import type {
  BuildCanvasData,
  BuildCanvasEchoDetail,
} from "@build/domain/build-canvas"
import { EchoesPanel } from "@build/presentation/components/build-canvas/echoes-panel"
import { ResonatorPanel } from "@build/presentation/components/build-canvas/resonator-panel"
import { SequencesPanel } from "@build/presentation/components/build-canvas/sequences-panel"
import { SkillsPanel } from "@build/presentation/components/build-canvas/skills-panel"
import { StatsPanel } from "@build/presentation/components/build-canvas/stats-panel"
import { WeaponPanel } from "@build/presentation/components/build-canvas/weapon-panel"

type BuildCanvasProps = {
  build: BuildCanvasData
  /** Uses the compact profile grid while keeping the canvas panels. */
  compact?: boolean
  echoDetails?: BuildCanvasEchoDetail[]
  sequences: ReactNode
  skills: ReactNode
  stats: ReactNode
  weaponProperties?: ReactNode
}

/** Read-only grid shared by the workspace and standalone renders. */
export function BuildCanvas({
  build,
  compact,
  echoDetails,
  sequences,
  skills,
  stats,
  weaponProperties,
}: BuildCanvasProps) {
  return (
    <div
      className="build-canvas pointer-events-none relative select-none"
      data-compact={compact || undefined}
    >
      <SequencesPanel>{sequences}</SequencesPanel>
      <ResonatorPanel build={build} />
      <StatsPanel>{stats}</StatsPanel>
      <SkillsPanel>{skills}</SkillsPanel>
      <WeaponPanel build={build} properties={weaponProperties} />
      <EchoesPanel build={build} details={echoDetails} />
    </div>
  )
}
