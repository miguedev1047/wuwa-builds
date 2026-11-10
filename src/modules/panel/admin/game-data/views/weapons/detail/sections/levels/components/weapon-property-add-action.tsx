import type { EncoreProperty } from "@encore/domain/property"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { WeaponPropertyAddForm } from "@panel/admin/game-data/views/weapons/detail/sections/levels/components/weapon-property-add-form"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type WeaponPropertyAddActionProps = {
  weaponId: number
  sortOrder: number
  isMaxProperties: boolean
  encoreProperties: EncoreProperty[]
  savedNames: string[]
}

/** Header action that opens the weapon property form inside a dialog. */
export function WeaponPropertyAddAction({
  weaponId,
  sortOrder,
  encoreProperties,
  isMaxProperties,
  savedNames,
}: WeaponPropertyAddActionProps) {
  return (
    <EditableSection.AddAction
      disabled={isMaxProperties}
      title="Agregar propiedad"
      description="Elige una propiedad o escribe sus datos."
      trigger={
        <EditableSection.ButtonAction variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Agregar
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <WeaponPropertyAddForm
          weaponId={weaponId}
          sortOrder={sortOrder}
          encoreProperties={encoreProperties}
          savedNames={savedNames}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.AddAction>
  )
}
