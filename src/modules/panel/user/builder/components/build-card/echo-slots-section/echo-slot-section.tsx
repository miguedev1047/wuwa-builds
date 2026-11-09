import { BuildCardSectionDialog } from "../../../ui/build-card-section"
import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import { EchoSlotEditor } from "./echo-slot-editor"
import { EchoSlotTrigger } from "./echo-slot-trigger"

type EchoSlotSectionProps = {
  slot: EchoesDataProps
}

/** Editable card for one echo slot. */
export function EchoSlotSection({ slot }: EchoSlotSectionProps) {
  return (
    <BuildCardSectionDialog
      title={`Eco ${slot.index + 1}`}
      description="Selecciona el eco del slot y ajusta su nivel."
      dialogContent={{ size: "lg" }}
      trigger={<EchoSlotTrigger slot={slot} />}
    >
      {() => <EchoSlotEditor slot={slot} />}
    </BuildCardSectionDialog>
  )
}
