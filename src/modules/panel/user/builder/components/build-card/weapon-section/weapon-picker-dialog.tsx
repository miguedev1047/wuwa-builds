import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"
import { SkeletonSuspense } from "skullet/react"
import { BuildCatalogPickerDialog } from "@builder/ui/build-catalog-picker"
import { WeaponPicker } from "@builder/components/build-card/weapon-section/weapon-picker"
import { WeaponPickerSkeleton } from "@builder/components/build-card/weapon-section/weapon-picker-skeleton"

/** Standalone dialog that replaces the weapon of the build. */
export function WeaponPickerDialog() {
  return (
    <BuildCatalogPickerDialog
      trigger={
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label="Cambiar arma"
          title="Cambiar arma"
        >
          <HugeiconsIcon
            icon={ArrowDataTransferHorizontalIcon}
            strokeWidth={2}
          />
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
