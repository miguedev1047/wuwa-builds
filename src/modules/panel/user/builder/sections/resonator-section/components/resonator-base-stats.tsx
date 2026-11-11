import { BuildTextHeader } from "@builder/ui/build-text-header"
import { ResonatorBaseStatItem } from "@builder/sections/resonator-section/components/resonator-base-stat-item"
import type { CharacterDetail } from "@game-data/domain/character"

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
      <BuildTextHeader size="lg">Estadísticas base</BuildTextHeader>

      <div className="flex flex-wrap items-center gap-4">
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
