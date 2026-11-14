import { useSuspenseQuery } from "@tanstack/react-query"
import { LEVEL_MILESTONES, stepFromLevel } from "@build/domain/build"
import type { BuildProps } from "@build/domain/build-record"
import { characterQueries } from "@catalog/queries/characters"
import { useResonatorProgress } from "@build/presentation/editor/sections/resonator-section/hooks/use-resonator-progress"
import { ResonatorLevelControl } from "@build/presentation/editor/sections/resonator-section/components/resonator-level-control"
import { ResonatorPortrait } from "@build/presentation/editor/sections/resonator-section/components/resonator-portrait"
import { ResonatorSequences } from "@build/presentation/editor/sections/resonator-section/components/resonator-sequences"
import { ResonatorSkills } from "@build/presentation/editor/sections/resonator-section/components/resonator-skills"
import { ResonatorPassives } from "@build/presentation/editor/sections/resonator-section/components/resonator-passives"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { ResonatorActions } from "@build/presentation/editor/sections/resonator-section/components/resonator-actions"
import { Separator } from "@/components/ui/separator"
import { ResonatorBaseStats } from "./resonator-base-stats"

type ResonatorSectionContentProps = {
  build: BuildProps
  resonatorId: number
}

/** Loaded resonator section: portrait, level, base stats and sequences. */
export function ResonatorSectionContent({
  build,
  resonatorId,
}: ResonatorSectionContentProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { setLevelStep, toggleSequence } = useResonatorProgress(build)

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex w-full items-center justify-between">
        <BuildWorkspace.Text family="bold" textColor="muted" size="xl">
          Resonador
        </BuildWorkspace.Text>
        <ResonatorActions build={build} />
      </div>

      <div className="flex h-full w-full flex-col justify-between gap-5">
        <ResonatorPortrait resonator={resonator} />
        <ResonatorLevelControl
          level={build.resonator.level}
          step={stepFromLevel(build.resonator.level)}
          maxStep={LEVEL_MILESTONES.length - 1}
          onStepChange={setLevelStep}
        />
        <ResonatorBaseStats
          level={build.resonator.level}
          properties={resonator.properties}
        />
        <ResonatorSequences
          sequences={resonator.sequences}
          rank={build.resonator.sequency}
          onToggle={toggleSequence}
        />
        <Separator />
        <ResonatorSkills build={build} resonatorId={resonator.id} />
        <Separator />
        <ResonatorPassives build={build} resonatorId={resonator.id} />
      </div>
    </div>
  )
}
