import type { BuildStatRow } from "@panel/user/builder-old/application/build-stat-rows"
import {
  formatFlatStat,
  formatPercentStat,
} from "@panel/user/builder-old/application/format-character-stats"
import { cn } from "cn"

interface BuildStatRowItemProps {
  row: BuildStatRow
}

function formatValue(row: BuildStatRow): string {
  return row.percent ? formatPercentStat(row.value) : formatFlatStat(row.value)
}

/** One label and value row of the build stats sheet. */
export function BuildStatRowItem({ row }: BuildStatRowItemProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="min-w-0 truncate text-xs font-medium">{row.label}</dt>
      <dd
        className={cn(
          "shrink-0 text-xs font-semibold tabular-nums",
          row.value === 0 ? "text-muted-foreground" : "text-brand-warning"
        )}
      >
        {formatValue(row)}
      </dd>
    </div>
  )
}
