import { Show } from "@/components/utility/show"
import { DEFAULT_SEQUENCY_RANK, WEAPON_LEVEL_MAX } from "@build/domain/build"
import type {
  BuildCanvasData,
  BuildCanvasPreview,
} from "@build/domain/build-canvas"
import { BuildBackground } from "@build/presentation/components/build-canvas/build-background"
import { buildCardFrameClassName } from "@build/presentation/components/build-canvas/build-card-frame"
import { BuildCanvas } from "@build/presentation/components/build-canvas/build-canvas"
import { SequencesContent } from "@build/presentation/components/build-canvas/sequences-panel/sequences-content"
import { SkillsPreview } from "@build/presentation/components/build-canvas/skills-panel/skills-preview"
import { StatsContent } from "@build/presentation/components/build-canvas/stats-panel/stats-content"
import { WeaponInfoProperties } from "@build/presentation/components/build-canvas/weapon-panel/weapon-info-properties"
import { cn } from "cn"
import type { Ref } from "react"

type ReadOnlyBuildCardProps = {
  /** Hydrated build display fields. */
  build: BuildCanvasData
  /** Resolved details and the calculated stats. */
  preview: BuildCanvasPreview
  /** Selects the fixed profile composition. Defaults to the export layout. */
  compact?: boolean
  /** Captures the framed card without including the editor wrapper. */
  ref?: Ref<HTMLDivElement>
}

/** Draws a complete, view-only build card from prepared data. */
export function ReadOnlyBuildCard({
  build,
  preview,
  compact,
  ref,
}: ReadOnlyBuildCardProps) {
  const { resonator, weapon, echoDetails, result } = preview

  return (
    <BuildBackground
      ref={ref}
      backgroundIndex={build.backgroundIndex}
      className={cn(buildCardFrameClassName, compact && "w-240")}
    >
      <BuildCanvas
        build={build}
        compact={compact}
        echoDetails={echoDetails}
        sequences={
          <Show when={resonator}>
            {(detail) => (
              <SequencesContent
                sequences={detail.sequences}
                currentSequency={
                  build.resonator.sequency ?? DEFAULT_SEQUENCY_RANK
                }
                showDescriptions={!compact}
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
    </BuildBackground>
  )
}
