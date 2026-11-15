import { Show } from "@/components/utility/show"
import type { BuildProps, EchoesDataProps } from "@build/domain/build-record"
import { Separator } from "@/components/ui/separator"
import { EchoSlotPortrait } from "./echo-slot-portrait"
import { EchoControls } from "./echo-controls"
import { useEchoProgress } from "../hooks/use-echo-progress"
import type { EchoDetail } from "@catalog/domain/echo"

type EchoSlotCardProps = {
  slot: EchoesDataProps
  /** True when the slot holds the main echo of the build. */
  isMain: boolean
  /** Icon of the selected sonata set, resolved by the caller. */
  setIcon?: string
  sets: EchoDetail["sets"]
  build: BuildProps
}

/**
 * Editable card of one echo slot.
 *
 * It is the section counterpart of the read-only `BuildEchoCard`: the canvas
 * keeps the compact artboard card, while the editor shows the currently selected slot and
 * opens the detail editor from its actions.
 */
export function EchoSlotCard({
  slot,
  isMain,
  setIcon,
  sets,
  build,
}: EchoSlotCardProps) {
  const progress = useEchoProgress(build)

  return (
    <Show when={slot.data}>
      {(echo) => (
        <>
          <EchoSlotPortrait
            isMain={isMain}
            setIcon={setIcon}
            slot={slot}
            echo={echo}
          />
          <Separator />
          <EchoControls
            slot={slot}
            sets={sets}
            isMain={isMain}
            progress={progress}
          />
        </>
      )}
    </Show>
  )
}
