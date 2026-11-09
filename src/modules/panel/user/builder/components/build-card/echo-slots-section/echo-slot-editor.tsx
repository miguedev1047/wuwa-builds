import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import { EchoControls } from "./echo-controls"
import { EchoSelection } from "./echo-selection"

type EchoSlotEditorProps = {
  slot: EchoesDataProps
}

/** Echo selection and controls of one slot. */
export function EchoSlotEditor({ slot }: EchoSlotEditorProps) {
  return (
    <div className="space-y-6">
      <EchoSelection slot={slot} />
      <EchoControls slot={slot} />
    </div>
  )
}
