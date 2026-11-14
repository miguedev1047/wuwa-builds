import type { ReactNode } from "react"
import type { BuildProps } from "@build/domain/build-record"
import type { EchoDetail } from "@catalog/domain/echo"
import { EchoesPanel } from "@build/presentation/editor/components/build-canvas/echoes-panel"
import { ResonatorPanel } from "@build/presentation/editor/components/build-canvas/resonator-panel"
import { SequencesPanel } from "@build/presentation/editor/components/build-canvas/sequences-panel"
import { SkillsPanel } from "@build/presentation/editor/components/build-canvas/skills-panel"
import { StatsPanel } from "@build/presentation/editor/components/build-canvas/stats-panel"
import { WeaponPanel } from "@build/presentation/editor/components/build-canvas/weapon-panel"

type BuildCanvasProps = {
  build: BuildProps
  echoDetails?: EchoDetail[]
  sequences: ReactNode
  skills: ReactNode
  stats: ReactNode
  weaponProperties?: ReactNode
}

/** Read-only grid shared by the workspace and standalone renders. */
export function BuildCanvas({
  build,
  echoDetails,
  sequences,
  skills,
  stats,
  weaponProperties,
}: BuildCanvasProps) {
  return (
    <div className="build-canvas relative">
      <SequencesPanel>{sequences}</SequencesPanel>
      <ResonatorPanel build={build} />
      <StatsPanel>{stats}</StatsPanel>
      <SkillsPanel>{skills}</SkillsPanel>
      <WeaponPanel build={build} properties={weaponProperties} />
      <EchoesPanel build={build} details={echoDetails} />
    </div>
  )
}
