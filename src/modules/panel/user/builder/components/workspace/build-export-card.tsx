import type { BuildProps } from "@builds/domain/build-record"
import { buildCardFrameClassName } from "@builder/components/build-canvas/build-card-frame"
import { BuildCanvas } from "@builder/components/build-canvas/build-canvas"
import { SequencesContent } from "@builder/components/build-canvas/sequences-panel/sequences-content"
import { SkillsPreview } from "@builder/components/build-canvas/skills-panel/skills-preview"
import { StatsContent } from "@builder/components/build-canvas/stats-panel/stats-content"
import { WeaponInfoProperties } from "@builder/components/build-canvas/weapon-panel/weapon-info-properties"
import { Show } from "@/components/utility/show"
import { DEFAULT_SEQUENCY_RANK, WEAPON_LEVEL_MAX } from "@builds/domain/build"
import type { useBuildStats } from "@panel/user/builds/application/use-build-stats"
import type { Ref } from "react"

type BuildExportCardProps = {
  build: BuildProps
  preview: ReturnType<typeof useBuildStats>
  captureRef: Ref<HTMLDivElement>
}

/** Render the card at its native size for capture outside the interactive stage. */
export function BuildExportCard({
  build,
  preview,
  captureRef,
}: BuildExportCardProps) {
  const { resonator, weapon, echoDetails, result } = preview

  return (
    <div
      aria-hidden="true"
      inert
      className="pointer-events-none fixed top-0 right-full"
    >
      <div ref={captureRef} className={buildCardFrameClassName}>
        <BuildCanvas
          build={build}
          echoDetails={echoDetails}
          sequences={
            <Show when={resonator}>
              {(detail) => (
                <SequencesContent
                  sequences={detail.sequences}
                  currentSequency={
                    build.resonator.sequency ?? DEFAULT_SEQUENCY_RANK
                  }
                />
              )}
            </Show>
          }
          skills={
            <Show when={resonator}>
              {(detail) => <SkillsPreview build={build} resonator={detail} />}
            </Show>
          }
          stats={<StatsContent build={build} result={result} />}
          weaponProperties={
            <Show when={weapon}>
              {(detail) => (
                <WeaponInfoProperties
                  properties={detail.properties}
                  level={build.weapon.level ?? WEAPON_LEVEL_MAX}
                />
              )}
            </Show>
          }
        />
      </div>
    </div>
  )
}
