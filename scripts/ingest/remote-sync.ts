/**
 * Shared machinery for the per-entity remote sync scripts.
 *
 * The local miniflare database (filled by the ingest pipeline and the admin
 * panel) is the source of truth; the remote is the deployed copy. Each phase
 * replaces its tables row by row, so D1 counts both the deletes and the
 * inserts as writes. Before touching anything the script estimates that
 * budget and aborts when it would exceed `--max-writes` (default 90,000), the
 * safety margin under the free tier's daily 100,000-row write limit.
 *
 * Usage from each entry script:
 *   bun scripts/ingest/sync-<entity>.ts [--max-writes 90000] [--dry-run]
 */

import { mkdirSync, writeFileSync } from "node:fs"
import { parseArgs } from "node:util"
import { openLocalCatalog } from "./catalog-db"

/** Hard safety margin under the free tier's 100,000 daily row writes. */
export const DEFAULT_MAX_WRITES = 90_000

/** Statement chunk limit; D1 rejects very large statements. */
const MAX_STATEMENT_CHARS = 40_000

interface RemoteRow {
  [column: string]: unknown
}

export interface RemotePhaseOptions {
  /** Phase name, used in the backup file and the log. */
  label: string
  /** Tables in insert order (parents before children). */
  tables: readonly string[]
  /**
   * Link tables that reference this phase's parents but belong to another
   * phase. They are cleared before the delete and restored from local after
   * the inserts, so foreign keys never block the replace.
   */
  dependents?: readonly string[]
  maxWrites?: number
  dryRun?: boolean
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
export async function remoteQuery(sql: string): Promise<RemoteRow[]> {
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

/** Columns of one local table, in row order. */
function tableColumns(
  run: (sql: string) => { results: RemoteRow[] },
  table: string
): string[] {
  return run(`pragma table_info(${table})`).results.map((column) =>
    String(column.name)
  )
}

function countLocal(
  run: (sql: string) => { results: RemoteRow[] },
  table: string
): number {
  return Number(
    (run(`select count(*) as n from ${table}`).results[0] as { n: number }).n
  )
}

async function countRemote(table: string): Promise<number> {
  const rows = await remoteQuery(`select count(*) as n from ${table}`)

  return Number((rows[0] as { n: number }).n)
}

/** Estimated writes for the phase: every delete plus every insert. */
async function estimateWrites(
  run: (sql: string) => { results: RemoteRow[] },
  tables: readonly string[]
): Promise<{
  total: number
  rows: { table: string; local: number; remote: number }[]
}> {
  let total = 0
  const rows: { table: string; local: number; remote: number }[] = []

  for (const table of tables) {
    const local = countLocal(run, table)
    const remote = await countRemote(table)
    total += local + remote
    rows.push({ table, local, remote })
  }

  return { total, rows }
}

/** Parses the flags every per-entity sync script accepts. */
export function parsePhaseArgs(): { maxWrites: number; dryRun: boolean } {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      "max-writes": { type: "string" },
      "dry-run": { type: "boolean" },
    },
    allowPositionals: true,
  })

  return {
    maxWrites: values["max-writes"]
      ? Number(values["max-writes"])
      : DEFAULT_MAX_WRITES,
    dryRun: values["dry-run"] === true,
  }
}

/** Replaces one phase of the catalog on the remote database. */
export async function runRemotePhase({
  label,
  tables,
  dependents = [],
  maxWrites = DEFAULT_MAX_WRITES,
  dryRun = false,
}: RemotePhaseOptions): Promise<void> {
  const allTables = [...new Set([...tables, ...dependents])]
  const catalog = openLocalCatalog({ readonly: true })
  const run = (sql: string) => catalog.local.runStatement(sql)

  console.log(`fase: ${label}`)
  console.log(`límite de escrituras: ${maxWrites.toLocaleString("es-CO")}`)

  const budget = await estimateWrites(run, allTables)

  console.log(
    "\ntabla".padEnd(30),
    "local".padStart(8),
    "remota".padStart(8),
    "escrituras".padStart(10)
  )
  for (const row of budget.rows) {
    console.log(
      row.table.padEnd(30),
      String(row.local).padStart(8),
      String(row.remote).padStart(8),
      String(row.local + row.remote).padStart(10)
    )
  }

  console.log("-".repeat(58))
  console.log(
    "TOTAL escrituras estimadas:".padEnd(48),
    String(budget.total).padStart(10)
  )

  if (budget.total > maxWrites) {
    throw new Error(
      `El presupuesto (${budget.total} escrituras) supera el límite de ${maxWrites}.`
    )
  }

  // Safety net: dump the current remote rows for the phase.
  const remoteBefore: string[] = []

  for (const table of allTables) {
    const rows = await remoteQuery(`select * from ${table}`)
    const columns = tableColumns(run, table)

    remoteBefore.push(
      ...buildInsertStatements(
        table,
        columns,
        rows.map((row) => columns.map((column) => row[column]))
      )
    )
  }

  mkdirSync(".tmp", { recursive: true })
  const backup = `.tmp/remote-${label}-before-sync.sql`
  writeFileSync(backup, remoteBefore.join(";\n") + ";\n", "utf8")
  console.log(
    `\nrespaldo remoto previo: ${backup} (${remoteBefore.length} statements)`
  )

  if (dryRun) {
    console.log("dry-run: sin cambios en la remota")
    return
  }

  // Dependents first, then the phase tables children-first.
  const deleteOrder = [...allTables].reverse()

  for (const table of deleteOrder) {
    await remoteQuery(`delete from ${table}`)
  }

  console.log("\ncatálogo remoto limpiado para la fase")

  for (const table of tables) {
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

  // Restore the dependent link tables from local, now that the parents exist.
  for (const table of dependents) {
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

    console.log(`  ${table} (restaurada): ${rows.length} filas`)
  }

  // Verify every table in the phase matches local.
  let mismatches = 0

  for (const table of allTables) {
    const local = countLocal(run, table)
    const remote = await countRemote(table)

    if (local !== remote) {
      mismatches += 1
      console.log(`  MISMATCH ${table}: local=${local} remota=${remote}`)
    }
  }

  console.log(
    mismatches === 0
      ? `verificación: ${allTables.length} tablas de la fase coinciden`
      : `verificación: ${mismatches} tablas con diferencias`
  )

  catalog.local.close()
}
