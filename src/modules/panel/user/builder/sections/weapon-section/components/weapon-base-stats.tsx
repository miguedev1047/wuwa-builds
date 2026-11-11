import { BuildTextHeader } from "@builder/ui/build-text-header"
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
    <div className="space-y-2">
      <BuildTextHeader size="lg">Estadísticas base</BuildTextHeader>

      <div className="flex flex-wrap items-center gap-4">
        {properties.map((property) => (
          <WeaponBaseStatItem
            key={property.id}
            property={property}
            level={level}
          />
        ))}
      </div>
    </div>
  )
}
