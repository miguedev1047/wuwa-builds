import type { EchoesDataProps } from "@builds/domain/build-record"
import { Show } from "@/components/utility/show"
import { EchoLevel } from "@builder/components/build-card/echo-slots-section/echo-level"
import { EchoMainStatSelect } from "@builder/components/build-card/echo-slots-section/echo-main-stat-select"
import { EchoMainToggle } from "@builder/components/build-card/echo-slots-section/echo-main-toggle"
import { EchoSetSelect } from "@builder/components/build-card/echo-slots-section/echo-set-select"
import { EchoSubstats } from "@builder/components/build-card/echo-slots-section/echo-substats"

type EchoControlsProps = {
  slot: EchoesDataProps
}

/** Sonata set, main stat, level and substats of the selected echo. */
export function EchoControls({ slot }: EchoControlsProps) {
  return (
    <Show when={slot.data}>
      {(echo) => (
        <div className="space-y-5 border-t pt-4">
          <EchoSetSelect echo={echo} slotIndex={slot.index} />
          <EchoMainStatSelect slotIndex={slot.index} />
          <EchoLevel slotIndex={slot.index} />
          <EchoSubstats slotIndex={slot.index} />
          <EchoMainToggle slotIndex={slot.index} />
        </div>
      )}
    </Show>
  )
}
