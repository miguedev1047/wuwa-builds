import { SkeletonSuspense } from "skullet/react"
import { ResonatorGrid } from "@/modules/panel/user/builder/components/resonator-selector/resonator-grid"
import { ResonatorListLoading } from "@/modules/panel/user/builder/components/resonator-selector/resonator-skeletons"
import { useBuilderId } from "@/modules/panel/user/builder/application/use-builder-id"
import { BuildCatalogPickerDialog } from "../../ui/build-catalog-picker"

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
        <SkeletonSuspense
          skeleton={<ResonatorListLoading columns={6} aspect="portrait" />}
        >
          <ResonatorGrid
            buildId={buildId}
            columns={6}
            aspect="portrait"
            onSelect={close}
          />
        </SkeletonSuspense>
      )}
    </BuildCatalogPickerDialog>
  )
}
