import { Show } from "@/components/utility/show"
import type { EchoesDataProps } from "@build/domain/build-record"
import type { EchoProgress } from "@build/presentation/editor/sections/echoes-section/hooks/use-echo-progress"
import { EchoLevelControl } from "@build/presentation/editor/sections/echoes-section/components/echo-level-control"
import { EchoMainStatSelect } from "@build/presentation/editor/sections/echoes-section/components/echo-main-stat-select"
import { EchoMainToggle } from "@build/presentation/editor/sections/echoes-section/components/echo-main-toggle"
import { EchoSetSelect } from "@build/presentation/editor/sections/echoes-section/components/echo-set-select"
import { EchoSubstats } from "@build/presentation/editor/sections/echoes-section/components/echo-substats"
import type { EchoDetail } from "@catalog/domain/echo"

type EchoControlsProps = {
  slot: EchoesDataProps
  sets: EchoDetail["sets"]
  isMain: boolean
  progress: EchoProgress
}

/** Sonata set, main stat, level and substats of the selected echo. */
export function EchoControls({
  slot,
  sets,
  isMain,
  progress,
}: EchoControlsProps) {
  return (
    <Show when={slot.data}>
      <div className="space-y-5 border-t pt-4">
        <EchoSetSelect
          sets={sets}
          selectedSetId={slot.echoSetId}
          onChange={(setId) => progress.setSet(slot.index, setId)}
        />

        <EchoMainStatSelect
          slot={slot}
          onChange={(option) => progress.setMainStat(slot.index, option)}
        />

        <EchoLevelControl
          slot={slot}
          onChange={(step) => progress.setLevelStep(slot.index, step)}
        />

        <EchoSubstats
          slot={slot}
          onStatChange={(substatIndex, option) =>
            progress.setSubstat(slot.index, substatIndex, option)
          }
          onValueChange={(substatIndex, value) =>
            progress.setSubstatValue(slot.index, substatIndex, value)
          }
        />

        <EchoMainToggle
          isMain={isMain}
          onToggle={() => progress.toggleMain(slot.index)}
        />
      </div>
    </Show>
  )
}
