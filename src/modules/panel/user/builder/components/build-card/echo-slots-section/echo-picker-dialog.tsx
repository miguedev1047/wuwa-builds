import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"
import { SkeletonSuspense } from "skullet/react"
import { BuildCatalogPickerDialog } from "../../../ui/build-catalog-picker"
import { EchoPicker } from "./echo-picker"
import { EchoPickerSkeleton } from "./echo-picker-skeleton"

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
          <HugeiconsIcon
            icon={ArrowDataTransferHorizontalIcon}
            strokeWidth={2}
          />
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
