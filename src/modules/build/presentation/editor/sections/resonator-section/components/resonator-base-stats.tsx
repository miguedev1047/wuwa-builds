import { ResonatorBaseStatItem } from "@build/presentation/editor/sections/resonator-section/components/resonator-base-stat-item"
import type { CharacterDetail } from "@catalog/domain/character"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"

/** The catalog exposes HP, ATK and DEF first; later properties are derived. */
const BASE_STAT_COUNT = 3

type ResonatorBaseStatsProps = {
  properties: CharacterDetail["properties"]
  /** Real game level used to resolve each growth row. */
  level: number
}

/** Base stats of the resonator at its current level. */
export function ResonatorBaseStats({
  properties,
  level,
}: ResonatorBaseStatsProps) {
  return (
    <div className="space-y-2">
      <BuildWorkspace.Text size="sm">Estadisticas base</BuildWorkspace.Text>
      <div className="space-y-1">
        {properties.slice(0, BASE_STAT_COUNT).map((property) => (
          <ResonatorBaseStatItem
            key={property.id}
            property={property}
            level={level}
          />
        ))}
      </div>
    </div>
  )
}
