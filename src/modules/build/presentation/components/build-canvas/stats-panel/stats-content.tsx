import type { BuildCanvasData } from "@build/domain/build-canvas"
import type { CharacterCalculationResult } from "@build/domain/character-stats"
import { StatsRowItem } from "@build/presentation/components/build-canvas/stats-panel/stats-row"
import { StatsSkeleton } from "@build/presentation/components/build-canvas/stats-panel/stats-skeleton"
import { statsRows } from "@build/presentation/helpers/stats-view-model"
import { BuildCanvasText } from "@build/presentation/components/build-canvas/build-canvas-primitives"

/** Derived stats of the current build. */
export function StatsContent({
  build,
  result,
  isLoading = false,
  isError = false,
}: {
  build: BuildCanvasData
  result: Pick<CharacterCalculationResult, "stats"> | null
  isLoading?: boolean
  isError?: boolean
}) {
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

  const rows = statsRows(result.stats, build.resonator.data?.element ?? null)

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <BuildCanvasText size="xs" family="bold">
        Estadísticas
      </BuildCanvasText>
      <dl className="grid min-h-0 grid-flow-col grid-cols-2 grid-rows-6 content-between gap-x-6 gap-y-4">
        {rows.map((row) => (
          <StatsRowItem key={row.key} row={row} />
        ))}
      </dl>
    </div>
  )
}
