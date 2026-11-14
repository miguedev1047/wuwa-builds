import { ResonatorBaseStatItem } from "@build/presentation/editor/sections/resonator-section/components/resonator-base-stat-item"
import type { CharacterDetail } from "@catalog/domain/character"

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
    <div className="flex flex-1 flex-col justify-center gap-2">
      {properties.slice(0, BASE_STAT_COUNT).map((property) => (
        <ResonatorBaseStatItem
          key={property.id}
          property={property}
          level={level}
        />
      ))}
    </div>
  )
}
