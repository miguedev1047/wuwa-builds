import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import { Button } from "@/components/ui/button"
import { SkeletonSuspense } from "skullet/react"
import { BuildCatalogPickerDialog } from "../../../ui/build-catalog-picker"
import { EchoPicker } from "./echo-picker"
import { EchoPickerSkeleton } from "./echo-picker-skeleton"

type EchoPickerDialogProps = {
  slot: EchoesDataProps
  /** Label of the button that opens the picker. */
  label: string
}

/** Nested dialog that selects the echo of one slot. */
export function EchoPickerDialog({ slot, label }: EchoPickerDialogProps) {
  return (
    <BuildCatalogPickerDialog
      trigger={
        <Button type="button" variant="outline" size="sm">
          {label}
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
