import type { EchoesDataProps } from "@build/domain/build-record"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { EchoPicker } from "@build/presentation/editor/sections/echoes-section/components/echo-picker"

type EchoPickerDialogProps = {
  slot: EchoesDataProps
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Dialog that replaces the echo of one slot. */
export function EchoPickerDialog({
  slot,
  open,
  onOpenChange,
}: EchoPickerDialogProps) {
  return (
    <BuildWorkspace.Dialog
      dialogProps={{ open, onOpenChange }}
      title="Selecciona un eco"
      description={`El eco elegido se asignará al slot ${slot.index + 1}.`}
    >
      {() => (
        <EchoPicker
          slot={slot}
          columns={4}
          onSelected={() => onOpenChange(false)}
        />
      )}
    </BuildWorkspace.Dialog>
  )
}
