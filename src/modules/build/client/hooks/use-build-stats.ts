import type { BuildProps } from "@build/domain/build-record"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { resolveBuildCalculation } from "@build/application/calculation/resolve-build-calculation"
import { characterQueries } from "@catalog/queries/characters"
import { echoQueries } from "@catalog/queries/echoes"
import { sonataQueries } from "@catalog/queries/sonatas"
import { weaponQueries } from "@catalog/queries/weapons"

function unique(values: number[]): number[] {
  return [...new Set(values)]
}

/** Resolve catalog data and calculate stats for the current draft. */
export function useBuildStats(build: BuildProps) {
  const resonatorId = build.resonator.data?.id
  const weaponId = build.weapon.data?.id
  const echoIds = unique(
    build.echoes.flatMap((echo) => (echo.data ? [echo.data.id] : []))
  )
  const setIds = unique(
    build.echoes.flatMap((echo) =>
      echo.echoSetId === null ? [] : [echo.echoSetId]
    )
  )

  const resonatorQuery = useQuery({
    ...characterQueries.detail(resonatorId ?? 0),
    enabled: resonatorId !== undefined,
  })

  const weaponQuery = useQuery({
    ...weaponQueries.detail(weaponId ?? 0),
    enabled: weaponId !== undefined,
  })

  const echoQuery = useQuery(echoQueries.details(echoIds))

  const sonataQuery = useQuery({
    ...sonataQueries.list(),
    enabled: setIds.length > 0,
  })

  const isLoading =
    resonatorQuery.isLoading ||
    (weaponId !== undefined && weaponQuery.isLoading) ||
    (echoIds.length > 0 && echoQuery.isLoading) ||
    (setIds.length > 0 && sonataQuery.isLoading)

  const isError =
    resonatorQuery.isError ||
    weaponQuery.isError ||
    echoQuery.isError ||
    sonataQuery.isError

  const result = useMemo(() => {
    if (!resonatorQuery.data) return null

    return resolveBuildCalculation({
      build,
      resonator: resonatorQuery.data,
      weapon: weaponQuery.data ?? null,
      echoDetails: echoQuery.data ?? [],
      sonatas: sonataQuery.data ?? [],
    })
  }, [
    build,
    resonatorQuery.data,
    weaponQuery.data,
    echoQuery.data,
    sonataQuery.data,
  ])

  return {
    result,
    isLoading,
    isError,
    resonator: resonatorQuery.data,
    weapon: weaponQuery.data,
    echoDetails: echoQuery.data,
  }
}
