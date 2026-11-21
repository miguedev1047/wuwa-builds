import type { BuildRecord } from "@build/application/ports/build-repository"
import {
  payloadToBuild,
  type BuildCatalogContext,
} from "@build/application/build-document"
import type { BuildProps } from "@build/domain/build-record"
import { characterQueries } from "@catalog/queries/characters"
import { echoQueries } from "@catalog/queries/echoes"
import { weaponQueries } from "@catalog/queries/weapons"
import type { EchoSummary } from "@catalog/domain/echo"
import type { QueryClient } from "@tanstack/react-query"

function uniqueIds(values: (number | null)[]): number[] {
  return [...new Set(values.filter((value): value is number => value !== null))]
}

/**
 * Hydrates saved build rows with the catalog rows they reference.
 *
 * One request per catalog list plus one detail per referenced resonator; the
 * shared query options keep those reads cached and deduplicated.
 */
export async function hydrateBuilds(
  records: BuildRecord[],
  queryClient: QueryClient
): Promise<BuildProps[]> {
  if (records.length === 0) return []

  const characterIds = uniqueIds(records.map((record) => record.characterId))
  const hasEchoes = records.some((record) =>
    record.payload.echoLoadout.some((slot) => slot.echoId !== null)
  )

  const [characters, weapons, details, echoSummaries] = await Promise.all([
    queryClient.query(characterQueries.list()),
    queryClient.query(weaponQueries.list()),
    Promise.all(
      characterIds.map((id) =>
        queryClient.query(characterQueries.detail(id)).catch(() => null)
      )
    ),
    hasEchoes ? queryClient.query(echoQueries.list()) : Promise.resolve([]),
  ])

  const characterById = new Map(characters.map((row) => [row.id, row]))
  const weaponById = new Map(weapons.map((row) => [row.id, row]))
  const detailById = new Map(
    details
      .filter((detail): detail is NonNullable<typeof detail> => detail !== null)
      .map((detail) => [detail.id, detail])
  )
  const echoById = new Map<number, EchoSummary>(
    echoSummaries.map((echo) => [echo.id, echo])
  )

  return records.map((record) => {
    const echoes = new Map<number, EchoSummary>()

    record.payload.echoLoadout.forEach((slot, index) => {
      if (slot.echoId === null) return

      const echo = echoById.get(slot.echoId)
      if (echo) echoes.set(index, echo)
    })

    const catalog: BuildCatalogContext = {
      character: record.characterId
        ? (characterById.get(record.characterId) ?? null)
        : null,
      detail: record.characterId
        ? (detailById.get(record.characterId) ?? null)
        : null,
      weapon: record.payload.weapon.weaponId
        ? (weaponById.get(record.payload.weapon.weaponId) ?? null)
        : null,
      echoes,
    }

    return payloadToBuild({ record, catalog })
  })
}
