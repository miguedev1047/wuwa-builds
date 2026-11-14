import type { EchoesDataProps } from "@build/domain/build-record"
import type { EchoProgress } from "@build/presentation/editor/sections/echoes-section/hooks/use-echo-progress"
import { EchoControls } from "@build/presentation/editor/sections/echoes-section/components/echo-controls"
import { EchoSelection } from "@build/presentation/editor/sections/echoes-section/components/echo-selection"
import type { EchoDetail } from "@catalog/domain/echo"

type EchoSlotEditorProps = {
  slot: EchoesDataProps
  sets: EchoDetail["sets"]
  isMain: boolean
  progress: EchoProgress
}

/** Echo selection and controls of one slot. */
export function EchoSlotEditor({
  slot,
  sets,
  isMain,
  progress,
}: EchoSlotEditorProps) {
  return (
    <div className="space-y-6">
      <EchoSelection slot={slot} />

      <EchoControls
        slot={slot}
        sets={sets}
        isMain={isMain}
        progress={progress}
      />
    </div>
  )
}
