import { useBuildStats } from "@panel/user/builds/application/use-build-stats"
import { useBuilderId } from "@builder/application/use-builder-id"
import { StatsRowItem } from "@builder/components/build-card/stats-section/stats-row"
import { StatsSkeleton } from "@builder/components/build-card/stats-section/stats-skeleton"
import { statsRows } from "@/modules/panel/user/builder/application/stats-view-model"

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
    <div className="space-y-4">
      <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Estadísticas
      </h2>

      <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-6">
        {rows.map((row) => (
          <StatsRowItem key={row.key} row={row} />
        ))}
      </dl>
    </div>
  )
}
