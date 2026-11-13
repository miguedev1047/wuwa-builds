import { WeaponBaseStatItem } from "@builder/sections/weapon-section/components/weapon-base-stat-item"
import type { WeaponDetail } from "@game-data/domain/weapon"

type WeaponBaseStatsProps = {
  properties: WeaponDetail["properties"]
  /** Real game level used to resolve each growth row. */
  level: number
}

/** Base stats of the weapon at its current level. */
export function WeaponBaseStats({ properties, level }: WeaponBaseStatsProps) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-2">
      {properties.map((property) => (
        <WeaponBaseStatItem
          key={property.id}
          property={property}
          level={level}
        />
      ))}
    </div>
  )
}
