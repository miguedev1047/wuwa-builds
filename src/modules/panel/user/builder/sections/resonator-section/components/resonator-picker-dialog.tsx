import { useBuilderId } from "../../../application/use-builder-id"
import { BuildWorkspace } from "../../../components/workspace"
import { ResonatorPicker } from "./resonator-picker"
import { useBuildCollection } from "@/modules/panel/user/builds/application/build-live-queries"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"

/** Change action of the resonator section, hosted in a catalog picker dialog. */
export function ResonatorPickerDialog() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const hasResonatorSelected = !!build?.resonator.data

  return (
    <BuildWorkspace.Dialog
      title="Selecciona un resonador"
      description="Al cambiar de resonador se reinician las habilidades, pasivas y el arma."
      triggerComponent={
        hasResonatorSelected ? (
          <Button variant="ghost" size="icon">
            <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} />
          </Button>
        ) : (
          <BuildWorkspace.Empty>
            <BuildWorkspace.EmptyTitle title="Seleccionar resonador" />
          </BuildWorkspace.Empty>
        )
      }
    >
      {({ close }) => (
        <ResonatorPicker
          buildId={buildId}
          columns={4}
          aspect="portrait"
          onSelected={close}
        />
      )}
    </BuildWorkspace.Dialog>
  )
}
