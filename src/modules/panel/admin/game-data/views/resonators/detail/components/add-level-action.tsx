import type { EncoreProperty } from "@/modules/encore/domain/property"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { PropertyLevelAddForm } from "@/modules/panel/admin/game-data/views/resonators/detail/components/property-level-form"

type ResonatorLevelAddActionProps = {
  resonatorId: number
  sortOrder: number
  isMaxProperties: boolean
  encoreProperties: EncoreProperty[]
  savedNames: string[]
}

/** Header action that opens the property level form inside a dialog. */
export function ResonatorLevelAddAction({
  resonatorId,
  sortOrder,
  encoreProperties,
  isMaxProperties,
  savedNames,
}: ResonatorLevelAddActionProps) {
  return (
    <EditableSection.AddAction
      disabled={isMaxProperties}
      title="Agregar propiedad"
      description="Elige una propiedad de Encore o escribe sus datos."
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
