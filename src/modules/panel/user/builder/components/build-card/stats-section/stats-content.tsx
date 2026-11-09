import { Badge } from "@/components/ui/badge"
import { useBuildStats } from "@/modules/panel/user/builds/application/use-build-stats"
import { useBuilderId } from "../../../application/use-builder-id"
import { StatsRowItem } from "./stats-row"
import { StatsSkeleton } from "./stats-skeleton"
import { statsRows } from "./stats-view-model"

/** Derived stats of the current build. */
export function StatsContent() {
  const buildId = useBuilderId()
  const { build, result, isLoading, isError } = useBuildStats({ buildId })

  if (isLoading) return <StatsSkeleton />

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground">
        No se pudieron calcular las estadísticas.
      </p>
    )
  }

  if (!result) return null

  const rows = statsRows(result.stats, build?.resonator.data?.element ?? null)

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">Estadísticas</h2>
        <Badge variant="outline">Nv. {build?.resonator.level}</Badge>
      </div>

      <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-6">
        {rows.map((row) => (
          <StatsRowItem key={row.key} row={row} />
        ))}
      </dl>
    </div>
  )
}
