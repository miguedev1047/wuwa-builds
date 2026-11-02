import { Button } from "@/components/ui/button"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { WeaponRefinementStatAddForm } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinement-stat-add-form"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type WeaponRefinementStatAddActionProps = {
  refinementId: number
  weaponId: number
  sortOrder: number
}

/** Card footer action that opens the stat dialog. */
export function WeaponRefinementStatAddAction({
  refinementId,
  weaponId,
  sortOrder,
}: WeaponRefinementStatAddActionProps) {
  return (
    <EditableSection.AddAction
      title="Agregar estadística"
      description="Selecciona una o más estadísticas y su valor."
      label="Agregar estadística"
      trigger={
        <Button type="button" variant="outline" size="icon">
          <HugeiconsIcon icon={PlusIcon} />
        </Button>
      }
    >
      {({ close }) => (
        <WeaponRefinementStatAddForm
          refinementId={refinementId}
          weaponId={weaponId}
          sortOrder={sortOrder}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.AddAction>
  )
}
