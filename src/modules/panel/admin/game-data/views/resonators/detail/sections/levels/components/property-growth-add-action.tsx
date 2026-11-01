import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ResonatorPropertyGrowthRow } from "@/db/schema"
import { Button } from "@/components/ui/button"
import type { EncorePropertyGrowth } from "@/modules/encore/domain/property"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { PropertyGrowthAddForm } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/levels/components/property-growth-add-form"

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
        <Button type="button" size="icon-sm" aria-label="Agregar nivel">
          <HugeiconsIcon icon={PlusSignIcon} />
        </Button>
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
