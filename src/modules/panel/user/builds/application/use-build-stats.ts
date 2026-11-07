import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { resolveBuildCalculation } from "@/modules/builds/application/calculation/resolve-build-calculation"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { echoQueries } from "@/modules/game-data/queries/echoes"
import { sonataQueries } from "@/modules/game-data/queries/sonatas"
import { weaponQueries } from "@/modules/game-data/queries/weapons"
import { useBuildCollection } from "@/modules/panel/user/builds/application/build-live-queries"

function unique(values: number[]): number[] {
  return [...new Set(values)]
}

/** Reactive adapter from the local build and catalog queries to CharacterStats. */
export function useBuildStats({ buildId }: { buildId: string }) {
  const { data: build } = useBuildCollection({ buildId })

  const resonatorId = build?.resonator.data?.id
  const weaponId = build?.weapon.data?.id
  const echoIds = unique(
    build?.echoes.flatMap((echo) => (echo.data ? [echo.data.id] : [])) ?? []
  )
  const setIds = unique(
    build?.echoes.flatMap((echo) =>
      echo.echoSetId === null ? [] : [echo.echoSetId]
    ) ?? []
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
    if (!build || !resonatorQuery.data) return null

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

  return { build, result, isLoading, isError }
}
