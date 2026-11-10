import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { JsonDevtool } from "@/components/utility/devtools"
import { normalizeElementId } from "@builds/application/calculation/normalize"
import { RESONATOR_ELEMENTS } from "@game-data/application/constants/resonator"
import { formatCharacterStats } from "@panel/user/builder-old/application/format-character-stats"
import { BuildStatRowItem } from "@panel/user/builder-old/components/build-stat-row"
import { buildStatRows } from "@panel/user/builder-old/application/build-stat-rows"
import { useBuildStats } from "@panel/user/builds/application/use-build-stats"

interface BuildStatsProps {
  buildId: string
  element: string | null
}

/** Derived build stats. The result is never persisted. */
export function BuildStats({ buildId, element }: BuildStatsProps) {
  const { result, isLoading, isError } = useBuildStats({ buildId })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-6">
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          No se pudieron calcular las estadísticas.
        </CardContent>
      </Card>
    )
  }

  if (!result) return null

  const elementId = normalizeElementId(element)
  const elementLabel =
    RESONATOR_ELEMENTS.find((option) => option.value === elementId)?.label ??
    elementId
  const rows = buildStatRows({
    stats: result.stats,
    elementId,
    elementLabel,
  })

  return (
    <>
      <Card>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-6">
            {rows.map((row) => (
              <BuildStatRowItem key={row.key} row={row} />
            ))}
          </dl>
        </CardContent>
      </Card>

      {import.meta.env.DEV && (
        <JsonDevtool
          title="Stats trace"
          data={{
            raw: result.trace,
            display: formatCharacterStats(result.stats),
          }}
        />
      )}
    </>
  )
}
