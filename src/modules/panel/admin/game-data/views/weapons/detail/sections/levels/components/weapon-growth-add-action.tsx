import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { WeaponPropertyGrowthRow } from "@/db/schema"
import type { EncorePropertyGrowth } from "@/modules/encore/domain/property"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { WeaponGrowthAddForm } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/levels/components/weapon-growth-add-form"

type WeaponGrowthAddActionProps = {
  propertyId: number
  weaponId: number
  sortOrder: number
  encoreGrowth: EncorePropertyGrowth[]
  savedGrowth: WeaponPropertyGrowthRow[]
}

/** Item action that opens the growth form inside a dialog. */
export function WeaponGrowthAddAction({
  propertyId,
  weaponId,
  sortOrder,
  encoreGrowth,
  savedGrowth,
}: WeaponGrowthAddActionProps) {
  return (
    <EditableSection.AddAction
      title="Agregar nivel"
      description="Elige niveles de Encore o escribe su valor."
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="icon"
          aria-label="Agregar nivel"
        >
          <HugeiconsIcon icon={PlusSignIcon} />
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <WeaponGrowthAddForm
          propertyId={propertyId}
          weaponId={weaponId}
          sortOrder={sortOrder}
          encoreGrowth={encoreGrowth}
          savedGrowth={savedGrowth}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.AddAction>
  )
}
