import { cn } from "cn"
import { formatStatValue, type StatsRow } from "./stats-view-model"

type StatsRowItemProps = {
  row: StatsRow
}

/** One label/value row of the stats card. */
export function StatsRowItem({ row }: StatsRowItemProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="min-w-0 truncate text-xs text-muted-foreground">
        {row.label}
      </dt>
      <dd
        className={cn(
          "shrink-0 text-xs font-semibold tabular-nums",
          row.value === 0 ? "text-muted-foreground" : "text-brand-warning"
        )}
      >
        {formatStatValue(row)}
      </dd>
    </div>
  )
}
