import { useSuspenseQuery } from "@tanstack/react-query"
import { LEVEL_MILESTONES, stepFromLevel } from "@builds/domain/build"
import type { BuildProps } from "@builds/domain/build-record"
import { characterQueries } from "@game-data/queries/characters"
import { useResonatorProgress } from "@builder/sections/resonator-section/application/use-resonator-progress"
import { ResonatorLevelControl } from "@builder/sections/resonator-section/components/resonator-level-control"
import { ResonatorPortrait } from "@builder/sections/resonator-section/components/resonator-portrait"
import { ResonatorSequences } from "@builder/sections/resonator-section/components/resonator-sequences"
import { BuildWorkspace } from "@builder/components/workspace"
import { ResonatorActions } from "@builder/sections/resonator-section/components/resonator-actions"

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
        <ResonatorActions build={build} resonator={resonator} />
      </div>

      <div className="flex h-full w-full flex-col justify-between gap-6">
        <ResonatorPortrait resonator={resonator} build={build} />

        <ResonatorLevelControl
          level={build.resonator.level}
          step={stepFromLevel(build.resonator.level)}
          maxStep={LEVEL_MILESTONES.length - 1}
          onStepChange={setLevelStep}
        />

        <ResonatorSequences
          sequences={resonator.sequences}
          rank={build.resonator.sequency}
          onToggle={toggleSequence}
        />
      </div>
    </div>
  )
}
