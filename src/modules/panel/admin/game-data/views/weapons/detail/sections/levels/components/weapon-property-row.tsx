import { ChevronDownIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type {
  WeaponPropertyGrowthRow,
  WeaponPropertyRow as WeaponPropertyRowData,
} from "@/db/schema"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Show } from "@/components/utility/show"
import type { EncoreProperty } from "@/modules/encore/domain/property"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { WeaponGrowthAddAction } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/levels/components/weapon-growth-add-action"
import { WeaponGrowthList } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/levels/components/weapon-growth-list"
import { WeaponPropertyDeleteAction } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/levels/components/weapon-property-delete-action"
import { statLabel } from "@/modules/game-data/application/stats/stats"

type WeaponPropertyRowProps = {
  property: WeaponPropertyRowData & { growth: WeaponPropertyGrowthRow[] }
  weaponId: number
  encoreProperty?: EncoreProperty
}

/** Collapsible base stat row with its growth values. */
export function WeaponPropertyRow({
  property,
  weaponId,
  encoreProperty,
}: WeaponPropertyRowProps) {
  const sortOrder =
    property.growth.reduce((max, entry) => Math.max(max, entry.sortOrder), 0) +
    1

  return (
    <Collapsible>
      <EditableSection.Item>
        <Show when={property.icon}>
          {(icon) => (
            <EditableSection.ItemMedia variant="image">
              <EditableSection.Image src={icon} alt={property.name} />
            </EditableSection.ItemMedia>
          )}
        </Show>

        <EditableSection.ItemContent>
          <EditableSection.ItemTitle>
            {statLabel(property.name)}
          </EditableSection.ItemTitle>
          <EditableSection.ItemDescription>
            Valor base: {property.baseValue} · {property.growth.length} niveles
          </EditableSection.ItemDescription>
        </EditableSection.ItemContent>

        <EditableSection.ItemActions>
          <CollapsibleTrigger
            render={
              <EditableSection.ButtonAction
                type="button"
                variant="icon"
                aria-label="Mostrar niveles"
              >
                <HugeiconsIcon icon={ChevronDownIcon} />
              </EditableSection.ButtonAction>
            }
          />

          <WeaponGrowthAddAction
            propertyId={property.id}
            weaponId={weaponId}
            sortOrder={sortOrder}
            encoreGrowth={encoreProperty?.growth ?? []}
            savedGrowth={property.growth}
          />

          <WeaponPropertyDeleteAction
            propertyId={property.id}
            weaponId={weaponId}
          />
        </EditableSection.ItemActions>
      </EditableSection.Item>

      <CollapsibleContent className="mt-4">
        <div className="px-3 pb-3">
          <WeaponGrowthList growth={property.growth} weaponId={weaponId} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
