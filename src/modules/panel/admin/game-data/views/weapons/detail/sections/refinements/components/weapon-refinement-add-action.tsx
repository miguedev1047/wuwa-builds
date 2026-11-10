import type { EncoreWeaponRefinement } from "@encore/domain/weapon"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { WeaponRefinementAddForm } from "@panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinement-add-form"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type WeaponRefinementAddActionProps = {
  weaponId: number
  sortOrder: number
  isMaxRefinements: boolean
  encoreRefinements: EncoreWeaponRefinement[]
  savedRanks: number[]
}

/** Header action that opens the refinement form inside a dialog. */
export function WeaponRefinementAddAction({
  weaponId,
  sortOrder,
  isMaxRefinements,
  encoreRefinements,
  savedRanks,
}: WeaponRefinementAddActionProps) {
  return (
    <EditableSection.AddAction
      disabled={isMaxRefinements}
      title="Agregar refinamiento"
      description="Elige un rango de Encore o escribe su efecto."
      trigger={
        <EditableSection.ButtonAction variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Agregar
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <WeaponRefinementAddForm
          weaponId={weaponId}
          sortOrder={sortOrder}
          encoreRefinements={encoreRefinements}
          savedRanks={savedRanks}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.AddAction>
  )
}
