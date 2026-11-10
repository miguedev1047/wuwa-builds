import { SkeletonSuspense } from "skullet/react"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"
import { BuildCatalogPickerDialog } from "@builder/ui/build-catalog-picker"
import {
  BuildCardSectionDialog,
  BuildCardTrigger,
} from "@builder/ui/build-card-section"
import { WeaponEditor } from "@builder/components/build-card/weapon-section/weapon-editor"
import { WeaponPicker } from "@builder/components/build-card/weapon-section/weapon-picker"
import { WeaponPickerDialog } from "@builder/components/build-card/weapon-section/weapon-picker-dialog"
import { WeaponPickerSkeleton } from "@builder/components/build-card/weapon-section/weapon-picker-skeleton"
import { WeaponTrigger } from "@builder/components/build-card/weapon-section/weapon-trigger"

/** Editable card for the weapon of the resonator. */
export function WeaponSection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  if (!build?.weapon.data) {
    return (
      <BuildCatalogPickerDialog
        trigger={
          <BuildCardTrigger>
            <WeaponTrigger />
          </BuildCardTrigger>
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

  return (
    <div className="relative h-full">
      <BuildCardSectionDialog
        title="Arma"
        description="Ajusta el nivel y el refinamiento del arma."
        dialogContent={{ size: "lg" }}
        trigger={<WeaponTrigger />}
      >
        {() => <WeaponEditor />}
      </BuildCardSectionDialog>

      <div className="absolute top-3 right-3 z-10">
        <WeaponPickerDialog />
      </div>
    </div>
  )
}
