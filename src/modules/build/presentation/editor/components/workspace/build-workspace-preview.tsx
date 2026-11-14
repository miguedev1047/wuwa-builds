import { Suspense } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { BuildCanvas } from "@build/presentation/editor/components/build-canvas/build-canvas"
import { SequencesContent } from "@build/presentation/editor/components/build-canvas/sequences-panel/sequences-content"
import { SequencesSkeleton } from "@build/presentation/editor/components/build-canvas/sequences-panel/sequences-skeleton"
import { SkillsPreview } from "@build/presentation/editor/components/build-canvas/skills-panel/skills-preview"
import { SkillsPreviewSkeleton } from "@build/presentation/editor/components/build-canvas/skills-panel/skills-preview-skeleton"
import { StatsContent } from "@build/presentation/editor/components/build-canvas/stats-panel/stats-content"
import { WeaponInfoProperties } from "@build/presentation/editor/components/build-canvas/weapon-panel/weapon-info-properties"
import { WeaponInfoPropertiesSkeleton } from "@build/presentation/editor/components/build-canvas/weapon-panel/weapon-info-properties-skeleton"
import { Show } from "@/components/utility/show"
import { DEFAULT_SEQUENCY_RANK, WEAPON_LEVEL_MAX } from "@build/domain/build"
import type { BuildProps } from "@build/domain/build-record"
import { characterQueries } from "@catalog/queries/characters"
import { weaponQueries } from "@catalog/queries/weapons"
import type { useBuildStats } from "@build/client/hooks/use-build-stats"

function PreviewSequences({
  build,
  resonatorId,
}: {
  build: BuildProps
  resonatorId: number
}) {
  const { data } = useSuspenseQuery(characterQueries.detail(resonatorId))
  return (
    <SequencesContent
      sequences={data.sequences}
      currentSequency={build.resonator.sequency ?? DEFAULT_SEQUENCY_RANK}
    />
  )
}

function PreviewSkills({
  build,
  resonatorId,
}: {
  build: BuildProps
  resonatorId: number
}) {
  const { data } = useSuspenseQuery(characterQueries.detail(resonatorId))
  return <SkillsPreview build={build} resonator={data} />
}

function PreviewWeaponProperties({
  weaponId,
  level,
}: {
  weaponId: number
  level: number
}) {
  const { data } = useSuspenseQuery(weaponQueries.detail(weaponId))
  return <WeaponInfoProperties properties={data.properties} level={level} />
}

/** Connect the standalone build card to the editor's catalog data. */
export function BuildWorkspacePreview({
  build,
  resonatorId,
  preview,
}: {
  build: BuildProps
  resonatorId: number
  preview: ReturnType<typeof useBuildStats>
}) {
  const { echoDetails, result, isLoading, isError } = preview

  return (
    <BuildCanvas
      build={build}
      echoDetails={echoDetails}
      sequences={
        <Suspense fallback={<SequencesSkeleton />}>
          <PreviewSequences build={build} resonatorId={resonatorId} />
        </Suspense>
      }
      skills={
        <Suspense fallback={<SkillsPreviewSkeleton />}>
          <PreviewSkills build={build} resonatorId={resonatorId} />
        </Suspense>
      }
      stats={
        <StatsContent
          build={build}
          result={result}
          isLoading={isLoading}
          isError={isError}
        />
      }
      weaponProperties={
        <Show when={build.weapon.data}>
          {(weapon) => (
            <Suspense fallback={<WeaponInfoPropertiesSkeleton />}>
              <PreviewWeaponProperties
                weaponId={weapon.id}
                level={build.weapon.level ?? WEAPON_LEVEL_MAX}
              />
            </Suspense>
          )}
        </Show>
      }
    />
  )
}
