import type { EchoesDataProps } from "@builds/domain/build-record"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"
import { SkeletonSuspense } from "skullet/react"
import { BuildCatalogPickerDialog } from "@builder/ui/build-catalog-picker"
import { EchoPicker } from "@builder/sections/echoes-section/components/echo-picker"
import { EchoPickerSkeleton } from "@builder/sections/echoes-section/components/echo-picker-skeleton"

type EchoPickerDialogProps = {
  slot: EchoesDataProps
}

/** Standalone dialog that replaces the echo of one slot. */
export function EchoPickerDialog({ slot }: EchoPickerDialogProps) {
  return (
    <BuildCatalogPickerDialog
      trigger={
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label={`Cambiar eco del slot ${slot.index + 1}`}
          title="Cambiar eco"
        >
          <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} />
        </Button>
      }
      title="Selecciona un eco"
      description={`El eco elegido se asignará al slot ${slot.index + 1}.`}
    >
      {({ close }) => (
        <SkeletonSuspense skeleton={<EchoPickerSkeleton />}>
          <EchoPicker slot={slot} onSelected={close} />
        </SkeletonSuspense>
      )}
    </BuildCatalogPickerDialog>
  )
}
