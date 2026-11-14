import type { EncoreProperty } from "@encore/domain/property"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { PropertyLevelAddForm } from "@catalog/presentation/resonators/detail/sections/levels/components/property-level-add-form"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
      trigger={
        <EditableSection.ButtonAction variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Agregar
        </EditableSection.ButtonAction>
      }
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
