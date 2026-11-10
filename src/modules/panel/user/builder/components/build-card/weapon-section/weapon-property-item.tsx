import { GameIcon } from "@/components/ui/game-icon"
import { isStatId, statLabel } from "@game-data/application/stats/stats"
import { growthValueAtLevel } from "@game-data/domain/character"
import type { WeaponDetail } from "@game-data/domain/weapon"

type WeaponPropertyItemProps = {
  property: WeaponDetail["properties"][number]
  level: number
}

/** One base stat of the weapon at a given level. */
export function WeaponPropertyItem({
  property,
  level,
}: WeaponPropertyItemProps) {
  const icon = isStatId(property.name) ? property.name : null

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border bg-muted/40 px-2.5 py-2">
      <div className="flex min-w-0 items-center gap-1.5">
        <GameIcon name={icon} />
        <span className="truncate text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          {statLabel(property.name)}
        </span>
      </div>

      <span className="shrink-0 text-xs font-semibold tabular-nums">
        {growthValueAtLevel(property.growth, level)}
      </span>
    </div>
  )
}
