import type { EchoesDataProps } from "@builds/domain/build-record"
import { EchoControls } from "@builder/components/build-card/echo-slots-section/echo-controls"
import { EchoSelection } from "@builder/components/build-card/echo-slots-section/echo-selection"

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
