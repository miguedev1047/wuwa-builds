import { ChevronDownIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type {
  ResonatorPropertyGrowthRow,
  ResonatorPropertyRow,
} from "@/db/schema"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Show } from "@/components/utility/show"
import type { EncoreProperty } from "@/modules/encore/domain/property"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { PropertyGrowthAddAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/levels/components/property-growth-add-action"
import { PropertyGrowthList } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/levels/components/property-growth-list"
import { PropertyLevelDeleteAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/levels/components/property-level-delete-action"

type PropertyLevelRowProps = {
  property: ResonatorPropertyRow & { growth: ResonatorPropertyGrowthRow[] }
  resonatorId: number
  encoreProperty?: EncoreProperty
}

/** Collapsible base stat row with its growth values. */
export function PropertyLevelRow({
  property,
  resonatorId,
  encoreProperty,
}: PropertyLevelRowProps) {
  const sortOrder =
    property.growth.reduce((max, entry) => Math.max(max, entry.sortOrder), 0) +
    1

  return (
    <Collapsible>
      <EditableSection.Item>
        <Show when={property.icon}>
          {(icon) => (
            <EditableSection.ItemMedia variant="image">
              <img
                src={icon}
                alt={property.name}
                className="size-full object-cover"
              />
            </EditableSection.ItemMedia>
          )}
        </Show>

        <EditableSection.ItemContent>
          <EditableSection.ItemTitle>{property.name}</EditableSection.ItemTitle>
          <EditableSection.ItemDescription>
            Valor base: {property.baseValue} · {property.growth.length} niveles
          </EditableSection.ItemDescription>
        </EditableSection.ItemContent>

        <EditableSection.ItemActions>
          <CollapsibleTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Mostrar niveles"
              >
                <HugeiconsIcon icon={ChevronDownIcon} />
              </Button>
            }
          />

          <PropertyGrowthAddAction
            propertyId={property.id}
            resonatorId={resonatorId}
            sortOrder={sortOrder}
            encoreGrowth={encoreProperty?.growth ?? []}
            savedGrowth={property.growth}
          />

          <PropertyLevelDeleteAction
            propertyLevelId={property.id}
            resonatorId={resonatorId}
          />
        </EditableSection.ItemActions>
      </EditableSection.Item>

      <CollapsibleContent>
        <div className="px-3 pb-3">
          <PropertyGrowthList
            growth={property.growth}
            resonatorId={resonatorId}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
