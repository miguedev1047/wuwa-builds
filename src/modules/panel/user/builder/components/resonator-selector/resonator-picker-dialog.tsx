import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"
import { ResonatorSelectorDialog } from "./resonator-selector-dialog"

/** Standalone dialog that replaces the resonator of the build. */
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
          <HugeiconsIcon
            icon={ArrowDataTransferHorizontalIcon}
            strokeWidth={2}
          />
        </Button>
      }
    />
  )
}
