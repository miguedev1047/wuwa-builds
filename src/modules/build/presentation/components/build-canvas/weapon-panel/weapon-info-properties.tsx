import { WeaponInfoPropertyItem } from "@build/presentation/components/build-canvas/weapon-panel/weapon-info-property-item"
import type { BuildCanvasWeaponProperty } from "@build/domain/build-canvas"

type WeaponInfoPropertiesProps = {
  properties: BuildCanvasWeaponProperty[]
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
