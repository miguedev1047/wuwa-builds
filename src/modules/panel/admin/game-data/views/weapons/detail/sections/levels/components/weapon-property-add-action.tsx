import type { EncoreProperty } from "@/modules/encore/domain/property"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { WeaponPropertyAddForm } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/levels/components/weapon-property-add-form"

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
