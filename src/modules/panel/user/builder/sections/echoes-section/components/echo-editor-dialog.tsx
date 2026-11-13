import type { EchoesDataProps } from "@builds/domain/build-record"
import type { EchoProgress } from "@builder/sections/echoes-section/application/use-echo-progress"
import { BuildWorkspace } from "@builder/components/workspace"
import { EchoSlotEditor } from "@builder/sections/echoes-section/components/echo-slot-editor"
import type { EchoDetail } from "@game-data/domain/echo"

type EchoEditorDialogProps = {
  slot: EchoesDataProps
  sets: EchoDetail["sets"]
  isMain: boolean
  progress: EchoProgress
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Dialog that edits the set, stats and level of one echo slot. */
export function EchoEditorDialog({
  slot,
  sets,
  isMain,
  progress,
  open,
  onOpenChange,
}: EchoEditorDialogProps) {
  return (
    <BuildWorkspace.Dialog
      dialogProps={{ open, onOpenChange }}
      title={`Eco ${slot.index + 1}`}
      description="Ajusta el set, la estadística principal, el nivel y las substats."
    >
      {() => (
        <EchoSlotEditor
          slot={slot}
          sets={sets}
          isMain={isMain}
          progress={progress}
        />
      )}
    </BuildWorkspace.Dialog>
  )
}
