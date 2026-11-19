/**
 * Compacts the growth tables to one base row per level milestone.
 *
 * Encore imports stored one row per individual level (96 per property) plus
 * duplicated rows on ascension unlocks; the panel and builder only read the
 * level nodes 1, 10, 20 ... 90 and `growthValueAtLevel` falls back to the
 * closest lower milestone, so only ten rows per property are needed. That was
 * also what dominated the D1 write budget (52k of the ~55k rows per full
 * sync).
 *
 * The compaction reuses `growthMilestones` from the catalog adapter, so the
 * stored rows are exactly what a fresh import produces: first Encore entry per
 * milestone (the un-ascended base value).
 *
 * Usage:
 *   bun scripts/ingest/compact-growth.ts [--dry-run]
 */

import { parseArgs } from "node:util"
import { openLocalCatalog } from "./catalog-db"
import { growthMilestones } from "@catalog/infrastructure/catalog-d1.server"

const TABLES = [
  {
    name: "resonator_property_growth",
    parent: "property_id",
  },
  {
    name: "weapon_property_growth",
    parent: "property_id",
  },
] as const

interface GrowthRow {
  id: number
  property_id: number
  sort_order: number
  level: number
  value_number: number | null
  value_text: string | null
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
    for (const table of TABLES) {
      const rows = catalog.local.runStatement(
        `select * from ${table.name} order by ${table.parent}, level, sort_order`
      ).results as unknown as GrowthRow[]

      const groups = new Map<number, GrowthRow[]>()

      for (const row of rows) {
        const list = groups.get(row.property_id) ?? []
        list.push(row)
        groups.set(row.property_id, list)
      }

      let kept = 0

      for (const [propertyId, list] of groups) {
        const milestones = growthMilestones(list)

        kept += milestones.length

        if (dryRun) continue

        const keepIds = new Set(milestones.map((row) => row.id))

        catalog.local.runStatement(
          `delete from ${table.name} where ${table.parent} = ${propertyId} and id not in (${[...keepIds].join(",")})`
        )

        milestones.forEach((row, index) => {
          catalog.local.runStatement(
            `update ${table.name} set sort_order = ${index} where id = ${row.id}`
          )
        })
      }

      const after = catalog.local.runStatement(
        `select count(*) as n, count(distinct level) as levels, min(sort_order) as lo, max(sort_order) as hi from ${table.name}`
      ).results[0] as { n: number; levels: number; lo: number; hi: number }

      console.log(
        `${table.name}: ${rows.length} → ${after.n} filas (${after.levels} niveles, sort_order ${after.lo}..${after.hi})${dryRun ? " [dry-run]" : ""}`
      )
    }

    if (!dryRun) {
      const integrity = catalog.local.runStatement("pragma integrity_check")
      console.log(
        "integridad:",
        (integrity.results[0] as { integrity_check: string }).integrity_check
      )
    }
  } finally {
    catalog.local.close()
  }
}

if (import.meta.main) {
  await main()
}
