/**
 * Imports every real echo from the Encore catalog that is still missing in
 * D1.
 *
 * The Encore list pollutes `Type = "Eco"` with entries that are not
 * player-collectible echoes, so the selection rules are explicit:
 *
 * - Cosmetic skin rows (`Fantasma:` and `Apariencia Fantasma` Type) are
 *   skipped.
 * - Untranslated pipeline leftovers (`MonsterInfo_...`) are skipped.
 * - The id `60200400+` zone holds character-kit clones and re-listed bosses;
 *   skipped.
 * - The `6030xxx` series are playable-character kit entries (basic attack
 *   texts, evenly spaced ids); skipped.
 * - A name already present in the catalog keeps its curated row; the extra
 *   Encore ids for the same echo (Insomne 6020014 vs the catalog's 6000053)
 *   are skipped.
 * - Among the remaining duplicates the lowest series wins, in preference
 *   order: `6000xxx` base, `39xxxxxx`, then early `6020xxx` (Rinascita).
 *
 * Usage:
 *   bun scripts/ingest/echo-import-rest.ts [--dry-run]
 */

import { parseArgs } from "node:util"
import { openLocalCatalog } from "./catalog-db"
import { fetchEncoreJson } from "@encore/infrastructure/http.server"
import { toEchoDetail } from "@encore/infrastructure/mapper.server"
import { saveEcho } from "@catalog/infrastructure/catalog-d1.server"

interface RawEchoListItem {
  Id: number
  Name: string
  Type?: string
  Rarity: number
}

/** Series preference for duplicate names; lower wins. */
function idPreference(id: number): number {
  if (id >= 6000000 && id < 6009999) return 0
  if (id >= 39000000 && id < 40000000) return 1
  return 2
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, " ")
}

/** The echoes that should be imported, one row per real collectible echo. */
export function selectNewEchoes(
  raw: RawEchoListItem[],
  catalogNames: Set<string>
): { id: number; name: string }[] {
  const clean = raw.filter((echo) => {
    if (echo.Type !== "Eco") return false
    if (echo.Name.startsWith("Fantasma:")) return false
    if (echo.Name.startsWith("MonsterInfo_")) return false
    if (echo.Id >= 60200400) return false
    if (echo.Id >= 6030000 && echo.Id < 6040000) return false

    return true
  })

  const byName = new Map<string, { id: number; name: string }>()

  for (const echo of clean) {
    const key = normalizeName(echo.Name)

    if (catalogNames.has(key)) continue

    const current = byName.get(key)

    if (!current || idPreference(echo.Id) < idPreference(current.id)) {
      byName.set(key, { id: echo.Id, name: echo.Name })
    }
  }

  return [...byName.values()].sort((left, right) => left.id - right.id)
}

async function main() {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: { "dry-run": { type: "boolean" } },
    allowPositionals: true,
  })

  const dryRun = values["dry-run"] === true
  const catalog = openLocalCatalog()

  try {
    const catalogEchoes = await catalog.db.query.echoes.findMany()
    const catalogNames = new Set(
      catalogEchoes.map((e) => normalizeName(e.name))
    )

    const data = await fetchEncoreJson<{ Echo?: RawEchoListItem[] }>(
      "echo?page=1"
    )
    const selected = selectNewEchoes(data.Echo ?? [], catalogNames)

    const costOf = (rarity: number) => (rarity === 0 ? 1 : rarity === 1 ? 3 : 4)
    const byCost: Record<string, number> = {}

    for (const echo of selected) {
      const raw = (data.Echo ?? []).find((entry) => entry.Id === echo.id)
      const cost = String(costOf(raw?.Rarity ?? 0))
      byCost[cost] = (byCost[cost] ?? 0) + 1
    }

    console.log(
      `a importar: ${selected.length} ecos | por costo: ${JSON.stringify(byCost)}`
    )

    if (dryRun) {
      for (const echo of selected) {
        console.log(`  ${echo.name} (${echo.id})`)
      }

      return
    }

    let imported = 0
    let failed = 0

    for (const echo of selected) {
      try {
        const rawDetail = await fetchEncoreJson<Record<string, unknown>>(
          `echo/${echo.id}`
        )
        const detail = toEchoDetail(rawDetail)

        await saveEcho(catalog.db, detail)
        imported += 1
        console.log(`  ok ${detail.name} (${detail.id})`)
      } catch (error) {
        failed += 1
        console.warn(
          `  [error] ${echo.name} (${echo.id}): ${(error as Error).message}`
        )
      }
    }

    console.log(`\nimportados: ${imported}, fallidos: ${failed}`)
  } finally {
    catalog.local.close()
  }
}

if (import.meta.main) {
  await main()
}
