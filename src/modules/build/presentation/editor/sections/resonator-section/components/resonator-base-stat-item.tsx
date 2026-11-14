import { GameIcon } from "@/components/ui/game-icon"
import { isStatId, statLabel } from "@catalog/application/stats/stats"
import { growthValueAtLevel } from "@catalog/domain/character"
import type { CharacterDetail } from "@catalog/domain/character"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"

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
    <BuildWorkspace.Card
      cardColor="input"
      className="flex flex-1 items-center justify-between px-3 py-2"
    >
      <div className="flex items-center gap-1 overflow-hidden">
        <GameIcon
          className="size-4 shrink-0"
          name={isStatId(property.name) ? property.name : null}
        />
        <h2 className="truncate text-xs">{statLabel(property.name)}</h2>
      </div>

      <h2 className="shrink-0 text-xs font-bold tabular-nums">
        {formatBaseValue(value)}
      </h2>
    </BuildWorkspace.Card>
  )
}
