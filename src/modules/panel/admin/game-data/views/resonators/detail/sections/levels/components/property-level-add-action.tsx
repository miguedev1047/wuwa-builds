import type { EncoreProperty } from "@/modules/encore/domain/property"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { PropertyLevelAddForm } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/levels/components/property-level-add-form"

type PropertyLevelAddActionProps = {
  resonatorId: number
  sortOrder: number
  isMaxProperties: boolean
  encoreProperties: EncoreProperty[]
  savedNames: string[]
}

/** Header action that opens the property level form inside a dialog. */
export function PropertyLevelAddAction({
  resonatorId,
  sortOrder,
  encoreProperties,
  isMaxProperties,
  savedNames,
}: PropertyLevelAddActionProps) {
  return (
    <EditableSection.AddAction
      disabled={isMaxProperties}
      title="Agregar propiedad"
      description="Elige una propiedad o escribe sus datos."
    >
      {({ close }) => (
        <PropertyLevelAddForm
          resonatorId={resonatorId}
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
