import { SkeletonSuspense } from "skullet/react"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { BuildCatalogPickerDialog } from "../../../ui/build-catalog-picker"
import {
  BuildCardSectionDialog,
  BuildCardTrigger,
} from "../../../ui/build-card-section"
import { WeaponEditor } from "./weapon-editor"
import { WeaponPicker } from "./weapon-picker"
import { WeaponPickerDialog } from "./weapon-picker-dialog"
import { WeaponPickerSkeleton } from "./weapon-picker-skeleton"
import { WeaponTrigger } from "./weapon-trigger"

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
