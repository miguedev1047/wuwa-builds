import { useBuilderId } from "@builder/application/use-builder-id"
import { ResonatorGrid } from "@builder/sections/resonator-section/components/resonator-grid"
import { BuildCatalogPickerDialog } from "@builder/ui/build-catalog-picker"

interface ResonatorSelectorDialogProps {
  /** Element that opens the resonator picker. */
  trigger: React.ReactElement
}

/** Dialog that picks a resonator with a six-column portrait grid. */
export function ResonatorSelectorDialog({
  trigger,
}: ResonatorSelectorDialogProps) {
  const buildId = useBuilderId()

  return (
    <BuildCatalogPickerDialog
      trigger={trigger}
      title="Selecciona un resonador"
      description="Al cambiar de resonador se reinician las habilidades, pasivas y el arma."
    >
      {({ close }) => (
        <ResonatorGrid
          buildId={buildId}
          columns={6}
          aspect="portrait"
          onSelect={close}
        />
      )}
    </BuildCatalogPickerDialog>
  )
}
