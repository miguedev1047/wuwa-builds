import { WeaponBaseStatItem } from "@build/presentation/editor/sections/weapon-section/components/weapon-base-stat-item"
import type { WeaponDetail } from "@catalog/domain/weapon"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"

type WeaponBaseStatsProps = {
  properties: WeaponDetail["properties"]
  /** Real game level used to resolve each growth row. */
  level: number
}

/** Base stats of the weapon at its current level. */
export function WeaponBaseStats({ properties, level }: WeaponBaseStatsProps) {
  return (
    <div className="space-y-2">
      <BuildWorkspace.Text size="sm">Estadisticas base</BuildWorkspace.Text>
      <div className="space-y-1">
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
