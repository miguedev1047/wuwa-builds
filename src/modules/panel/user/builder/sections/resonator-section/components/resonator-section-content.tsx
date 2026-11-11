import { useSuspenseQuery } from "@tanstack/react-query"
import { LEVEL_MILESTONES, stepFromLevel } from "@builds/domain/build"
import type { BuildProps } from "@builds/domain/build-record"
import { characterQueries } from "@game-data/queries/characters"
import { useResonatorProgress } from "@builder/sections/resonator-section/application/use-resonator-progress"
import { ResonatorBaseStats } from "@builder/sections/resonator-section/components/resonator-base-stats"
import { ResonatorIdentity } from "@builder/sections/resonator-section/components/resonator-identity"
import { ResonatorLevelControl } from "@builder/sections/resonator-section/components/resonator-level-control"
import { ResonatorPortrait } from "@builder/sections/resonator-section/components/resonator-portrait"
import { ResonatorSequences } from "@builder/sections/resonator-section/components/resonator-sequences"

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
  const { setLevelStep, toggleSequence } = useResonatorProgress(build.buildId)

  return (
    <div className="flex w-full flex-col items-start gap-4 md:flex-row">
      <ResonatorPortrait resonator={resonator} />

      <div className="flex h-full w-full flex-col justify-between gap-6">
        <ResonatorIdentity build={build} resonator={resonator} />

        <ResonatorLevelControl
          level={build.resonator.level}
          step={stepFromLevel(build.resonator.level)}
          maxStep={LEVEL_MILESTONES.length - 1}
          onStepChange={setLevelStep}
        />

        <ResonatorBaseStats
          properties={resonator.properties}
          level={build.resonator.level}
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
