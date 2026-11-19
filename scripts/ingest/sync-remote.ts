/**
 * Replicates the local catalog to the remote D1 database.
 *
 * The local miniflare database (filled by the ingest pipeline and the admin
 * panel) is the source of truth; the remote is the deployed copy. Only the
 * catalog tables are replicated — auth, builds and bookkeeping tables are
 * never touched.
 *
 * Usage:
 *   bun scripts/ingest/sync-remote.ts [--dry-run]
 *
 * Reads CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_TOKEN and CLOUDFLARE_DATABASE_ID
 * from .env. Before wiping, the current remote catalog rows are dumped to
 * .tmp/remote-catalog-before-sync.sql as a safety net.
 */

import { parseArgs } from "node:util"
import { mkdirSync, writeFileSync } from "node:fs"
import { openLocalCatalog } from "./catalog-db"

/**
 * Catalog tables in insert order: parents first, so every foreign key target
 * exists before its children are inserted.
 */
const INSERT_ORDER = [
  "sonata_sets",
  "weapons",
  "echoes",
  "resonators",
  "sonata_set_effects",
  "echo_sets",
  "echo_skills",
  "echo_skill_bonuses",
  "weapon_properties",
  "weapon_property_growth",
  "weapon_refinements",
  "weapon_refinement_stats",
  "resonators_media",
  "resonator_tags",
  "resonator_property_levels",
  "resonator_property_growth",
  "resonator_skills",
  "resonator_sequences",
  "resonator_passives",
  "resonator_best_weapons",
  "resonator_best_sets",
] as const

/** Delete order: children first, so no foreign key blocks a parent delete. */
const DELETE_ORDER = [...INSERT_ORDER].reverse()

/** Statement chunk limit; D1 rejects statements around 100 KB. */
const MAX_STATEMENT_CHARS = 40_000

interface RemoteRow {
  [column: string]: unknown
}

function remoteEnv() {
  const accountId = Bun.env.CLOUDFLARE_ACCOUNT_ID
  const token = Bun.env.CLOUDFLARE_D1_TOKEN ?? Bun.env.CLOUDFLARE_API_TOKEN
  const databaseId = Bun.env.CLOUDFLARE_DATABASE_ID

  if (!accountId || !token || !databaseId) {
    throw new Error(
      "Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_TOKEN and CLOUDFLARE_DATABASE_ID in .env"
    )
  }

  return { accountId, token, databaseId }
}

/** Runs one statement against the remote database through the D1 HTTP API. */
async function remoteQuery(sql: string): Promise<RemoteRow[]> {
  const { accountId, token, databaseId } = remoteEnv()

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ sql }),
    }
  )

  const json = (await response.json()) as {
    success: boolean
    errors?: unknown[]
    result?: { results?: RemoteRow[] }[]
  }

  if (!json.success) {
    throw new Error(
      `${sql.slice(0, 120)}\n${JSON.stringify(json.errors ?? json)}`
    )
  }

  return json.result?.[0]?.results ?? []
}

/** Serializes one raw SQLite value into a SQL literal. */
function literal(value: unknown): string {
  if (value === null || value === undefined) return "NULL"
  if (typeof value === "number") return String(value)
  if (typeof value === "bigint") return value.toString()
  if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`

  throw new Error(`Unsupported literal: ${String(value)}`)
}

/** Groups rows into multi-row INSERT statements under the size limit. */
function buildInsertStatements(
  table: string,
  columns: string[],
  rows: unknown[][]
): string[] {
  const statements: string[] = []
  let current: string[] = []
  let length = 0

  for (const row of rows) {
    const values = `(${row.map(literal).join(",")})`
    length += values.length

    current.push(values)

    if (length >= MAX_STATEMENT_CHARS) {
      statements.push(
        `insert into "${table}" (${columns.map((c) => `"${c}"`).join(",")}) values ${current.join(",")}`
      )
      current = []
      length = 0
    }
  }

  if (current.length > 0) {
    statements.push(
      `insert into "${table}" (${columns.map((c) => `"${c}"`).join(",")}) values ${current.join(",")}`
    )
  }

  return statements
}

/** Columns of one table, in row order. */
function tableColumns(
  run: (sql: string) => { results: RemoteRow[] },
  table: string
): string[] {
  const info = run(`pragma table_info(${table})`).results

  return info.map((column) => String(column.name))
}

async function main() {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: { "dry-run": { type: "boolean" } },
    allowPositionals: true,
  })

  const dryRun = values["dry-run"] === true
  const catalog = openLocalCatalog({ readonly: true })
  const run = (sql: string) => catalog.local.runStatement(sql)

  console.log(`local: ${catalog.file}`)

  // Safety net: dump the current remote catalog before touching it.
  const remoteBefore: string[] = []

  for (const table of INSERT_ORDER) {
    const rows = await remoteQuery(`select * from ${table}`)
    const columns = tableColumns(run, table)

    remoteBefore.push(
      ...buildInsertStatements(
        table,
        columns,
        rows.map((row) => columns.map((c) => row[c]))
      )
    )
  }

  mkdirSync(".tmp", { recursive: true })
  writeFileSync(
    ".tmp/remote-catalog-before-sync.sql",
    remoteBefore.join(";\n") + ";\n",
    "utf8"
  )
  console.log(
    `respaldo remoto previo: .tmp/remote-catalog-before-sync.sql (${remoteBefore.length} statements)`
  )

  if (dryRun) {
    console.log("dry-run: sin cambios en la remota")
    return
  }

  // Children first.
  for (const table of DELETE_ORDER) {
    await remoteQuery(`delete from ${table}`)
  }

  console.log("catálogo remoto limpiado")

  // Parents first.
  for (const table of INSERT_ORDER) {
    const columns = tableColumns(run, table)
    const rows = run(`select * from ${table}`).results as RemoteRow[]
    const statements = buildInsertStatements(
      table,
      columns,
      rows.map((row) => columns.map((column) => row[column]))
    )

    for (const statement of statements) {
      await remoteQuery(statement)
    }

    console.log(
      `  ${table}: ${rows.length} filas (${statements.length} statements)`
    )
  }

  // Verify: every table must match the local count.
  let mismatches = 0

  for (const table of INSERT_ORDER) {
    const localCount = Number(
      (run(`select count(*) as n from ${table}`).results[0] as { n: number }).n
    )
    const remoteCount = Number(
      (
        (await remoteQuery(`select count(*) as n from ${table}`))[0] as {
          n: number
        }
      ).n
    )

    if (localCount !== remoteCount) {
      mismatches += 1
      console.log(
        `  MISMATCH ${table}: local=${localCount} remota=${remoteCount}`
      )
    }
  }

  console.log(
    mismatches === 0
      ? "verificación: conteos locales y remotos coinciden en las 21 tablas"
      : `verificación: ${mismatches} tablas con diferencias`
  )

  catalog.local.close()
}

if (import.meta.main) {
  await main()
}
