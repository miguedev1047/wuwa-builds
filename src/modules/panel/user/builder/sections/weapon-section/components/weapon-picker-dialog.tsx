import { SkeletonSuspense } from "skullet/react"
import { Button } from "@/components/ui/button"
import { WeaponPicker } from "@builder/sections/weapon-section/components/weapon-picker"
import { WeaponPickerLoading } from "@/modules/panel/user/builder/sections/weapon-section/ui-states/weapon-loading"
import { BuildCatalogPickerDialog } from "@builder/ui/build-catalog-picker"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
          <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} />
        </Button>
      }
      title="Selecciona un arma"
      description="Solo se muestran las armas compatibles con el resonador."
    >
      {({ close }) => (
        <SkeletonSuspense skeleton={<WeaponPickerLoading />}>
          <WeaponPicker onSelected={close} />
        </SkeletonSuspense>
      )}
    </BuildCatalogPickerDialog>
  )
}
