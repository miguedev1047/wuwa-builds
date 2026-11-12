import { useSuspenseQuery } from "@tanstack/react-query"
import { WeaponInfoPropertyItem } from "@builder/components/build-canvas/weapon-panel/weapon-info-property-item"
import type { WeaponSummary } from "@game-data/domain/weapon"
import { weaponQueries } from "@game-data/queries/weapons"

type WeaponInfoPropertiesProps = {
  weapon: WeaponSummary
  level: number
}

/** Base properties of the selected weapon at its current level. */
export function WeaponInfoProperties({
  weapon,
  level,
}: WeaponInfoPropertiesProps) {
  const { data: detail } = useSuspenseQuery(weaponQueries.detail(weapon.id))

  return (
    <div className="grid grid-cols-1 gap-2">
      {detail.properties.map((property) => (
        <WeaponInfoPropertyItem
          key={property.id}
          property={property}
          level={level}
        />
      ))}
    </div>
  )
}
