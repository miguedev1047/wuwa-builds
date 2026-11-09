import { BuildCardSectionDialog } from "../../../ui/build-card-section"
import { WeaponEditor } from "./weapon-editor"
import { WeaponTrigger } from "./weapon-trigger"

/** Editable card for the weapon of the resonator. */
export function WeaponSection() {
  return (
    <BuildCardSectionDialog
      title="Arma"
      description="Elige un arma compatible con el resonador y ajusta su nivel y refinamiento."
      dialogContent={{ size: "lg" }}
      trigger={<WeaponTrigger />}
    >
      {() => <WeaponEditor />}
    </BuildCardSectionDialog>
  )
}
