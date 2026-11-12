import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { ResonatorSelectorDialog } from "@builder/sections/resonator-section/components/resonator-selector-dialog"

/** Change action of the resonator section, hosted in a catalog picker dialog. */
export function ResonatorPickerDialog() {
  return (
    <ResonatorSelectorDialog
      trigger={
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label="Cambiar resonador"
          title="Cambiar resonador"
        >
          <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} />
        </Button>
      }
    />
  )
}
