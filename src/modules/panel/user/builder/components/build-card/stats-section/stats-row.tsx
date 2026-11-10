import { cn } from "cn"
import { formatStatValue, type StatsRow } from "./stats-view-model"
import { GameIcon } from "@/components/ui/game-icon"

type StatsRowItemProps = {
  row: StatsRow
}

/** One label/value row of the stats card. */
export function StatsRowItem({ row }: StatsRowItemProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-1">
        <GameIcon name={row.key} />
        <dt className="min-w-0 truncate">{row.label}</dt>
      </div>
      <dd
        className={cn(
          "shrink-0 font-semibold tabular-nums",
          row.value === 0 ? "" : "text-brand-warning"
        )}
      >
        {formatStatValue(row)}
      </dd>
    </div>
  )
}
