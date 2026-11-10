import { useSuspenseQuery } from "@tanstack/react-query"
import type { WeaponSummary } from "@game-data/domain/weapon"
import { weaponQueries } from "@game-data/queries/weapons"
import { WeaponPropertyItem } from "@builder/components/build-card/weapon-section/weapon-property-item"

type WeaponPropertiesProps = {
  weapon: WeaponSummary
  level: number
}

/** Base properties of the selected weapon at its current level. */
export function WeaponProperties({ weapon, level }: WeaponPropertiesProps) {
  const { data: detail } = useSuspenseQuery(weaponQueries.detail(weapon.id))

  return (
    <div className="grid grid-cols-2 gap-2">
      {detail.properties.map((property) => (
        <WeaponPropertyItem
          key={property.id}
          property={property}
          level={level}
        />
      ))}
    </div>
  )
}
