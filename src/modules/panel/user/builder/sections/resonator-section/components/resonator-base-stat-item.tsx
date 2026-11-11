import { GameIcon } from "@/components/ui/game-icon"
import { isStatId, statLabel } from "@game-data/application/stats/stats"
import { growthValueAtLevel } from "@game-data/domain/character"
import type { CharacterDetail } from "@game-data/domain/character"
import { BuildCard } from "@builder/ui/build-card"

type ResonatorBaseStatItemProps = {
  property: CharacterDetail["properties"][number]
  /** Real game level used to resolve the growth row. */
  level: number
}

/** Flat stats are rounded at the UI boundary; percent rows keep their text. */
function formatBaseValue(value: number | string): string {
  return typeof value === "number" ? String(Math.round(value)) : value
}

/** One base stat of the resonator at its current level. */
export function ResonatorBaseStatItem({
  property,
  level,
}: ResonatorBaseStatItemProps) {
  const value = growthValueAtLevel(property.growth, level)

  return (
    <BuildCard className="flex min-w-64 flex-1 flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <GameIcon
          className="size-7"
          name={isStatId(property.name) ? property.name : null}
        />
        <h2>{statLabel(property.name)}</h2>
      </div>

      <p className="font-bold tabular-nums">{formatBaseValue(value)}</p>
    </BuildCard>
  )
}
