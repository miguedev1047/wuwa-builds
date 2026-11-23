import { payloadToBuild } from "@build/application/build-document"
import { resolveBuildCalculation } from "@build/application/calculation/resolve-build-calculation"
import type { BuildRecord } from "@build/application/ports/build-repository"
import { BUILD_DOCUMENT_VERSION, buildPayloadSchema } from "@build/domain/build"
import {
  readCatalogCharacterDetail,
  readCatalogEchoDetails,
  readCatalogSonataDetails,
  readCatalogWeaponDetails,
} from "@catalog/infrastructure/build-catalog-details.server"
import type { AppDb } from "@db/create"
import { toProfileRosterCard } from "@home/application/profile/to-profile-roster-card"
import type { ProfileRosterCard } from "@home/domain/profile-roster"
import { readProfileRosterBuildRows } from "@home/infrastructure/profile/profile-roster-repository.server"

/** D1 allows up to 100 bound parameters per statement. */
const CATALOG_BATCH_SIZE = 90

async function readCatalogBatches<T>(
  candidates: (number | null)[],
  read: (ids: number[]) => Promise<T[]>
) {
  const ids = [...new Set(candidates.filter((id) => id !== null))]
  const batches: Promise<T[]>[] = []
  for (let index = 0; index < ids.length; index += CATALOG_BATCH_SIZE) {
    batches.push(read(ids.slice(index, index + CATALOG_BATCH_SIZE)))
  }
  return (await Promise.all(batches)).flat()
}

/** Loads and calculates all renderable variants of one authorized roster. */
export async function readProfileRosterCards(
  database: AppDb,
  userId: string,
  characterId: number,
  viewerId: string | undefined
): Promise<ProfileRosterCard[]> {
  const rows = await readProfileRosterBuildRows(
    database,
    userId,
    characterId,
    viewerId
  )
  const records = rows.flatMap<BuildRecord>((row) => {
    if (row.payload === null || row.documentVersion > BUILD_DOCUMENT_VERSION)
      return []
    const payload = buildPayloadSchema.safeParse(JSON.parse(row.payload))
    return payload.success ? [{ ...row, payload: payload.data }] : []
  })
  if (records.length === 0) return []

  const slots = records.flatMap(({ payload }) => payload.echoLoadout)
  const [resonator, weapons, echoes, sonatas] = await Promise.all([
    readCatalogCharacterDetail(database, characterId),
    readCatalogBatches(
      records.map(({ payload }) => payload.weapon.weaponId),
      (ids) => readCatalogWeaponDetails(database, ids)
    ),
    readCatalogBatches(
      slots.map(({ echoId }) => echoId),
      (ids) => readCatalogEchoDetails(database, ids)
    ),
    readCatalogBatches(
      slots.map(({ sonataId }) => sonataId),
      (ids) => readCatalogSonataDetails(database, ids)
    ),
  ])
  if (!resonator) return []

  const weaponById = new Map(weapons.map((weapon) => [weapon.id, weapon]))
  const echoById = new Map(echoes.map((echo) => [echo.id, echo]))
  const sonataById = new Map(sonatas.map((sonata) => [sonata.id, sonata]))

  return records.flatMap((record) => {
    const { weaponId } = record.payload.weapon
    const weapon = weaponId === null ? null : weaponById.get(weaponId)
    if (weapon === undefined) return []

    const echoSlots = new Map<number, (typeof echoes)[number]>()
    for (const [
      index,
      { echoId, sonataId },
    ] of record.payload.echoLoadout.entries()) {
      if (sonataId !== null && !sonataById.has(sonataId)) return []
      if (echoId === null) continue
      const echo = echoById.get(echoId)
      if (!echo) return []
      echoSlots.set(index, echo)
    }

    const build = payloadToBuild({
      record,
      catalog: {
        character: resonator,
        detail: resonator,
        weapon,
        echoes: echoSlots,
      },
    })
    const echoDetails = [...new Set(echoSlots.values())]
    const result = resolveBuildCalculation({
      build,
      resonator,
      weapon,
      echoDetails,
      sonatas,
    })
    return [
      toProfileRosterCard({ build, resonator, weapon, echoDetails, result }),
    ]
  })
}
