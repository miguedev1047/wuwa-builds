import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { Show } from "@/components/utility/show"
import { EchoLevel } from "./echo-level"
import { EchoMainStatSelect } from "./echo-main-stat-select"
import { EchoMainToggle } from "./echo-main-toggle"
import { EchoSetSelect } from "./echo-set-select"
import { EchoSubstats } from "./echo-substats"

type EchoControlsProps = {
  slot: EchoesDataProps
}

/** Sonata set, main stat, level and substats of the selected echo. */
export function EchoControls({ slot }: EchoControlsProps) {
  return (
    <Show when={slot.data}>
      {(echo) => (
        <div className="space-y-5 border-t pt-4">
          <SkeletonSuspense
            skeleton={<SkeletonBox width="100%" height={40} radius={8} />}
          >
            <EchoSetSelect echo={echo} slotIndex={slot.index} />
          </SkeletonSuspense>

          <EchoMainStatSelect slotIndex={slot.index} />
          <EchoLevel slotIndex={slot.index} />
          <EchoSubstats slotIndex={slot.index} />
          <EchoMainToggle slotIndex={slot.index} />
        </div>
      )}
    </Show>
  )
}
