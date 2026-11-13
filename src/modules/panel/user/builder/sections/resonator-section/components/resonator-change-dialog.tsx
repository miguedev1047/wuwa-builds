import { BuildWorkspace } from "@builder/components/workspace"
import { ResonatorPicker } from "@builder/sections/resonator-section/components/resonator-picker"
import type { BuildProps } from "@builds/domain/build-record"

type ResonatorChangeDialogProps = {
  build: BuildProps
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Dialog that swaps the resonator of the build. */
export function ResonatorChangeDialog({
  build,
  onOpenChange,
  open,
}: ResonatorChangeDialogProps) {
  return (
    <BuildWorkspace.Dialog
      dialogProps={{ open, onOpenChange }}
      title="Selecciona un resonador"
      description="Al cambiar de resonador se reinician las habilidades, pasivas y el arma."
    >
      {() => (
        <ResonatorPicker
          buildId={build.buildId}
          columns={4}
          aspect="portrait"
          onSelected={() => onOpenChange(!open)}
        />
      )}
    </BuildWorkspace.Dialog>
  )
}
