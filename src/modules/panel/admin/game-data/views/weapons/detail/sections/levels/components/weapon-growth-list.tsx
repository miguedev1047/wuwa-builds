import type { WeaponPropertyGrowthRow } from "@db/schema"
import { formatWeaponGrowthValue } from "@game-data/application/weapons/property-growth"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { WeaponGrowthDeleteAction } from "@panel/admin/game-data/views/weapons/detail/sections/levels/components/weapon-growth-delete-action"

type WeaponGrowthListProps = {
  growth: WeaponPropertyGrowthRow[]
  weaponId: number
}

/** Growth values of a weapon property, each one deletable. */
export function WeaponGrowthList({ growth, weaponId }: WeaponGrowthListProps) {
  return (
    <EditableSection.List
      className="grid md:grid-cols-2"
      items={growth}
      getItemKey={(entry) => entry.id}
      empty={
        <EditableSection.Text>Sin niveles agregados.</EditableSection.Text>
      }
    >
      {(entry) => (
        <EditableSection.Item size="sm">
          <EditableSection.ItemContent>
            <EditableSection.ItemTitle>
              Nivel {entry.level}
            </EditableSection.ItemTitle>
            <EditableSection.ItemDescription>
              <span className="tabular-nums">
                {formatWeaponGrowthValue(entry)}
              </span>
            </EditableSection.ItemDescription>
          </EditableSection.ItemContent>

          <EditableSection.ItemActions>
            <WeaponGrowthDeleteAction growthId={entry.id} weaponId={weaponId} />
          </EditableSection.ItemActions>
        </EditableSection.Item>
      )}
    </EditableSection.List>
  )
}
