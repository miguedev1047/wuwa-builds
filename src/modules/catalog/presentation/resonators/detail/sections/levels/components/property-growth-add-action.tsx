import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ResonatorPropertyGrowthRow } from "@db/schema"
import type { EncorePropertyGrowth } from "@encore/domain/property"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { PropertyGrowthAddForm } from "@catalog/presentation/resonators/detail/sections/levels/components/property-growth-add-form"

type PropertyGrowthAddActionProps = {
  propertyId: number
  resonatorId: number
  sortOrder: number
  encoreGrowth: EncorePropertyGrowth[]
  savedGrowth: ResonatorPropertyGrowthRow[]
}

/** Item action that opens the growth form inside a dialog. */
export function PropertyGrowthAddAction({
  propertyId,
  resonatorId,
  sortOrder,
  encoreGrowth,
  savedGrowth,
}: PropertyGrowthAddActionProps) {
  return (
    <EditableSection.AddAction
      title="Agregar nivel"
      description="Elige un nivel de Encore o escribe su valor."
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
        <PropertyGrowthAddForm
          propertyId={propertyId}
          resonatorId={resonatorId}
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
