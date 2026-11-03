/**
 * Applies the generated Drizzle migrations to D1.
 *
 * `wrangler d1 migrations apply` cannot be used here: it reads a flat
 * `migrations` folder while drizzle writes `drizzle/<timestamp>_<name>/migration.sql`,
 * and D1 keeps no `drizzle_migrations` bookkeeping. This script reads those
 * folders, records what was applied in a `drizzle_migrations` table and runs the
 * pending SQL either against the local miniflare database (through the wrangler
 * CLI) or against the remote one (through the D1 HTTP API with the token from
 * `.env`).
 *
 * Usage:
 *   bun scripts/d1-migrations.ts local [--latest] [--dry-run] [--mark-applied]
 *   bun scripts/d1-migrations.ts remote [--latest] [--dry-run] [--mark-applied]
 *
 * Flags:
 *   --latest        apply only the newest pending migration
 *   --dry-run       print the pending SQL without touching the database
 *   --mark-applied  record the pending migrations as applied without running them
 *
 * Run `--mark-applied` once on a database that was migrated before this script
 * existed, otherwise every old migration counts as pending.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const DRIZZLE_DIR = "drizzle"
const WRANGLER_CONFIG = "wrangler.jsonc"
const BOOKKEEPING_TABLE = "drizzle_migrations"
const BOOKKEEPING_DDL = `create table if not exists ${BOOKKEEPING_TABLE} (name text primary key, applied_at integer not null default (unixepoch()))`
const BOOKKEEPING_EXISTS = `select count(*) as count from sqlite_master where type = 'table' and name = '${BOOKKEEPING_TABLE}'`

export type Target = "local" | "remote"

export interface Migration {
  name: string
  path: string
  sql: string
  /**
   * Whether the folder carries the drizzle snapshot.
   *
   * The snapshot is what `drizzle-kit generate` diffs against, so a migration
   * without one still applies but breaks the next `generate`.
   */
  hasSnapshot: boolean
}

export interface Flags {
  latest: boolean
  dryRun: boolean
  markApplied: boolean
}

/** Every generated migration, in timestamp order. */
export function listMigrations(root = DRIZZLE_DIR): Migration[] {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((name) => {
      const path = join(root, name, "migration.sql")

      return {
        name,
        path,
        sql: readFileSync(path, "utf8"),
        hasSnapshot: existsSync(join(root, name, "snapshot.json")),
      }
    })
}

/** Splits a generated migration on the drizzle statement separator. */
export function splitStatements(sql: string): string[] {
  return sql
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter(Boolean)
}

/** Migrations a database has not recorded yet. */
export function pendingMigrations(
  migrations: Migration[],
  applied: string[]
): Migration[] {
  const done = new Set(applied)

  return migrations.filter((migration) => !done.has(migration.name))
}

interface DatabaseTarget {
  /** `database_name` in `wrangler.jsonc`. */
  name: string
  /** `database_id` in `wrangler.jsonc`. */
  id: string
}

/** Reads the D1 binding from `wrangler.jsonc` so the name is never duplicated. */
export function readWranglerDatabase(path = WRANGLER_CONFIG): DatabaseTarget {
  const raw = readFileSync(path, "utf8")
  const name = raw.match(/"database_name"\s*:\s*"([^"]+)"/)?.[1]
  const id = raw.match(/"database_id"\s*:\s*"([^"]+)"/)?.[1]

  if (!name || !id) {
    throw new Error(`${path} has no d1_databases[0].database_name/_id`)
  }

  return { name, id }
}

function quote(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

function runWrangler(args: string[]): string {
  const result = Bun.spawnSync({
    cmd: [process.execPath, "x", "wrangler", ...args],
    stdout: "pipe",
    stderr: "pipe",
  })

  if (result.exitCode !== 0) {
    const stderr = result.stderr.toString().trim()
    throw new Error(`wrangler ${args.join(" ")} failed\n${stderr}`)
  }

  return result.stdout.toString()
}

function localCommand(name: string, sql: string, json = false): string {
  return runWrangler([
    "d1",
    "execute",
    name,
    "--local",
    ...(json ? ["--json"] : []),
    "--command",
    sql,
  ])
}

function localRows(name: string, sql: string): Record<string, unknown>[] {
  const output = localCommand(name, sql, true)
  const start = output.search(/^\[/m)
  const parsed = JSON.parse(output.slice(start)) as {
    results?: Record<string, unknown>[]
  }[]

  return parsed[0]?.results ?? []
}

/** Applies one statement to the local database through wrangler. */
export function runLocalStatement(name: string, statement: string): void {
  localCommand(name, statement)
}

interface RemoteEnv {
  accountId: string
  databaseId: string
  token: string
}

function remoteEnv(fallback: DatabaseTarget): RemoteEnv {
  const accountId = Bun.env.CLOUDFLARE_ACCOUNT_ID
  const token = Bun.env.CLOUDFLARE_D1_TOKEN
  const databaseId = Bun.env.CLOUDFLARE_DATABASE_ID ?? fallback.id

  if (!accountId || !token) {
    throw new Error(
      "Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_D1_TOKEN in .env to migrate the remote database"
    )
  }

  return { accountId, databaseId, token }
}

/** Runs one statement against the remote database through the D1 HTTP API. */
export async function runRemoteStatement(
  statement: string,
  fallback: DatabaseTarget
): Promise<unknown[]> {
  const { accountId, databaseId, token } = remoteEnv(fallback)

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ sql: statement }),
    }
  )

  const json = (await response.json()) as {
    success: boolean
    errors?: unknown[]
    result?: { results?: unknown[] }[]
  }

  if (!json.success) {
    throw new Error(`${statement}\n${JSON.stringify(json.errors ?? json)}`)
  }

  return json.result?.[0]?.results ?? []
}

function appliedLocal(name: string, create: boolean): string[] {
  if (create) localCommand(name, BOOKKEEPING_DDL)

  const exists = localRows(name, BOOKKEEPING_EXISTS)[0]?.count

  if (!exists) return []

  return localRows(
    name,
    `select name from ${BOOKKEEPING_TABLE} order by name`
  ).map((row) => String(row.name))
}

async function appliedRemote(
  fallback: DatabaseTarget,
  create: boolean
): Promise<string[]> {
  if (create) await runRemoteStatement(BOOKKEEPING_DDL, fallback)

  const exists = (await runRemoteStatement(BOOKKEEPING_EXISTS, fallback))[0] as
    { count: number } | undefined

  if (!exists?.count) return []

  const rows = await runRemoteStatement(
    `select name from ${BOOKKEEPING_TABLE} order by name`,
    fallback
  )

  return rows.map((row) => String((row as { name: string }).name))
}

function markLocal(name: string, migration: Migration): void {
  localCommand(
    name,
    `insert or ignore into ${BOOKKEEPING_TABLE} (name) values (${quote(migration.name)})`
  )
}

async function markRemote(
  fallback: DatabaseTarget,
  migration: Migration
): Promise<void> {
  await runRemoteStatement(
    `insert or ignore into ${BOOKKEEPING_TABLE} (name) values (${quote(migration.name)})`,
    fallback
  )
}

function parseArgs(argv: string[]): { target: Target; flags: Flags } {
  const [target, ...rest] = argv
  const known = new Set(["--latest", "--dry-run", "--mark-applied", "--help"])

  if (target === "--help" || target === "-h") {
    console.log(usage())
    process.exit(0)
  }

  if (target !== "local" && target !== "remote") {
    console.error(usage())
    process.exit(1)
  }

  const unknown = rest.filter((arg) => !known.has(arg))

  if (unknown.length > 0) {
    console.error(`Unknown flags: ${unknown.join(" ")}\n`)
    console.error(usage())
    process.exit(1)
  }

  return {
    target,
    flags: {
      latest: rest.includes("--latest"),
      dryRun: rest.includes("--dry-run"),
      markApplied: rest.includes("--mark-applied"),
    },
  }
}

function usage(): string {
  return [
    "Usage:",
    "  bun scripts/d1-migrations.ts local [--latest] [--dry-run] [--mark-applied]",
    "  bun scripts/d1-migrations.ts remote [--latest] [--dry-run] [--mark-applied]",
    "",
    "  --latest        apply only the newest pending migration",
    "  --dry-run       print the pending SQL without touching the database",
    "  --mark-applied  record the pending migrations as applied without running them",
  ].join("\n")
}

async function main(): Promise<void> {
  const { target, flags } = parseArgs(process.argv.slice(2))
  const database = readWranglerDatabase()
  const all = listMigrations()
  const applied =
    target === "local"
      ? appliedLocal(database.name, !flags.dryRun)
      : await appliedRemote(database, !flags.dryRun)

  let pending = pendingMigrations(all, applied)

  if (flags.latest) {
    pending = pending.slice(-1)
  }

  if (pending.length === 0) {
    console.log(`${database.name} (${target}) is up to date`)
    return
  }

  const missingSnapshots = pending.filter((migration) => !migration.hasSnapshot)

  if (missingSnapshots.length > 0) {
    console.warn(
      `warning: ${missingSnapshots
        .map((migration) => migration.name)
        .join(
          ", "
        )} has no snapshot.json; the next drizzle-kit generate will diff against an older schema`
    )
  }

  console.log(
    `${database.name} (${target}) → ${pending.length} pending: ${pending
      .map((migration) => migration.name)
      .join(", ")}`
  )

  for (const migration of pending) {
    const statements = splitStatements(migration.sql)

    for (const statement of statements) {
      if (flags.dryRun) {
        const terminated = statement.endsWith(";") ? statement : `${statement};`

        console.log(`\n-- ${migration.name}\n${terminated}`)
      }
    }

    if (flags.dryRun) continue

    if (flags.markApplied) {
      if (target === "local") {
        markLocal(database.name, migration)
      } else {
        await markRemote(database, migration)
      }

      console.log(`marked ${migration.name}`)
      continue
    }

    for (const statement of statements) {
      if (target === "local") {
        runLocalStatement(database.name, statement)
      } else {
        await runRemoteStatement(statement, database)
      }
    }

    if (target === "local") {
      markLocal(database.name, migration)
    } else {
      await markRemote(database, migration)
    }

    console.log(`applied ${migration.name}`)
  }
}

if (import.meta.main) {
  await main()
}
