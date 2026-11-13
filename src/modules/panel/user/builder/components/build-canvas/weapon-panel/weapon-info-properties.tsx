import { WeaponInfoPropertyItem } from "@builder/components/build-canvas/weapon-panel/weapon-info-property-item"
import type { WeaponDetail } from "@game-data/domain/weapon"

type WeaponInfoPropertiesProps = {
  properties: WeaponDetail["properties"]
  level: number
}

/** Base properties of the selected weapon at its current level. */
export function WeaponInfoProperties({
  properties,
  level,
}: WeaponInfoPropertiesProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {properties.map((property) => (
        <WeaponInfoPropertyItem
          key={property.id}
          property={property}
          level={level}
        />
      ))}
    </div>
  )
}
