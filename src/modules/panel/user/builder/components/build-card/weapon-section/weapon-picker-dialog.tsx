import { Button } from "@/components/ui/button"
import { SkeletonSuspense } from "skullet/react"
import { BuildCatalogPickerDialog } from "../../../ui/build-catalog-picker"
import { WeaponPicker } from "./weapon-picker"
import { WeaponPickerSkeleton } from "./weapon-picker-skeleton"

type WeaponPickerDialogProps = {
  /** Label of the button that opens the picker. */
  label: string
}

/** Nested dialog that selects the weapon of the build. */
export function WeaponPickerDialog({ label }: WeaponPickerDialogProps) {
  return (
    <BuildCatalogPickerDialog
      trigger={
        <Button type="button" variant="outline" size="sm">
          {label}
        </Button>
      }
      title="Selecciona un arma"
      description="Solo se muestran las armas compatibles con el resonador."
    >
      {({ close }) => (
        <SkeletonSuspense skeleton={<WeaponPickerSkeleton />}>
          <WeaponPicker onSelected={close} />
        </SkeletonSuspense>
      )}
    </BuildCatalogPickerDialog>
  )
}
