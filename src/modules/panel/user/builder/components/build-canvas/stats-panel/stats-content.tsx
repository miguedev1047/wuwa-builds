import { useBuildStats } from "@panel/user/builds/application/use-build-stats"
import { useBuilderId } from "@builder/application/use-builder-id"
import { StatsRowItem } from "@builder/components/build-canvas/stats-panel/stats-row"
import { StatsSkeleton } from "@builder/components/build-canvas/stats-panel/stats-skeleton"
import { statsRows } from "@/modules/panel/user/builder/application/stats-view-model"
import { BuildTextHeader } from "../../../ui/build-text-header"

/** Derived stats of the current build. */
export function StatsContent() {
  const buildId = useBuilderId()
  const { build, result, isLoading, isError } = useBuildStats({ buildId })

  if (isLoading) {
    return (
      <div className="h-full min-h-0">
        <StatsSkeleton />
      </div>
    )
  }

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
    <div className="flex h-full min-h-0 flex-col gap-4">
      <BuildTextHeader size="lg">Estadísticas</BuildTextHeader>
      <dl className="grid min-h-0 grid-flow-col grid-cols-2 grid-rows-6 content-between gap-x-6 gap-y-4">
        {rows.map((row) => (
          <StatsRowItem key={row.key} row={row} />
        ))}
      </dl>
    </div>
  )
}
