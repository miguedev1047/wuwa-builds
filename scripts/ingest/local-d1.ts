import { Database } from "bun:sqlite"
import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"

/**
 * D1 shim over the miniflare SQLite file used by `bun run dev`.
 *
 * The dev server owns its own connection; both run in WAL mode, so a second
 * connection from this script is safe as long as writes stay short and use a
 * busy timeout. Tables are read through Drizzle elsewhere; raw curation SQL
 * runs through `execStatements`.
 */

const D1_STATE_DIR = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject"

/** Time (ms) this connection waits for the dev server to release a write. */
const BUSY_TIMEOUT_MS = 10_000

/**
 * Finds the miniflare SQLite file behind the `wuwa_builds` binding.
 *
 * The directory name is a hash of the database id, so the file is discovered
 * instead of hardcoded. Only non-`metadata` databases live there; if several
 * exist the most recently modified one wins and the choice is reported.
 */
export function findLocalD1File(): string {
  const files = readdirSync(D1_STATE_DIR)
    .filter((name) => name.endsWith(".sqlite") && name !== "metadata.sqlite")
    .map((name) => {
      const path = join(D1_STATE_DIR, name)

      return { path, mtime: statSync(path).mtimeMs }
    })
    .sort((left, right) => right.mtime - left.mtime)

  if (files.length === 0) {
    throw new Error(
      `No miniflare D1 file under ${D1_STATE_DIR}; run bun run dev once first`
    )
  }

  if (files.length > 1) {
    console.warn(
      `[local-d1] several D1 files found, using ${files[0].path} (${files
        .slice(1)
        .map((file) => file.path)
        .join(", ")} ignored)`
    )
  }

  return files[0].path
}

/** D1-style result shape Drizzle and callers already expect. */
interface D1Row {
  [column: string]: unknown
}

interface D1Result {
  results: D1Row[]
  success: boolean
  meta: Record<string, unknown>
}

/** SQLite values D1 accepts, mapped from JS by Drizzle. */
type SqliteValue = string | number | bigint | Uint8Array | null

/** Normalizes a Drizzle bound parameter into a SQLite value. */
function toSqlite(value: unknown): SqliteValue {
  if (value === undefined) return null
  if (value === null) return null
  if (value === true) return 1
  if (value === false) return 0
  if (value instanceof Date) return value.getTime()
  if (typeof value === "number") return value
  if (typeof value === "string") return value
  if (typeof value === "bigint") return value
  if (value instanceof Uint8Array || value instanceof ArrayBuffer) {
    return new Uint8Array(value as ArrayBuffer)
  }

  throw new Error(`Unsupported bind parameter: ${String(value)}`)
}

/** Local D1 binding backed by one SQLite connection to the miniflare file. */
export class LocalD1 {
  private readonly db: Database

  constructor(
    file: string,
    options: { readonly?: boolean; busyTimeoutMs?: number } = {}
  ) {
    this.db = new Database(file, {
      readonly: options.readonly ?? false,
    })
    this.db
      .query(
        `pragma busy_timeout = ${options.busyTimeoutMs ?? BUSY_TIMEOUT_MS}`
      )
      .run()
    // `saveCharacter` relies on `ON DELETE CASCADE`, which SQLite only
    // enforces when the pragma is on.
    this.db.query("pragma foreign_keys = ON").run()
  }

  /** Runs one SQL statement (no parameters) against the local file. */
  runStatement(statement: string): D1Result {
    const stmt = this.db.prepare(statement)
    const results = stmt.all() as D1Row[]

    return { results, success: true, meta: {} }
  }

  prepare(query: string) {
    const statement = this.db.prepare(query)

    const bound = (params: SqliteValue[]) => ({
      all: async (): Promise<D1Result> => ({
        results: statement.all(...params) as D1Row[],
        success: true,
        meta: {},
      }),
      first: async (): Promise<D1Row | null> =>
        (statement.get(...params) as D1Row | null) ?? null,
      raw: async (): Promise<unknown[]> => statement.values(...params),
      run: async (): Promise<D1Result> => {
        const result = statement.run(...params)

        return {
          results: [],
          success: true,
          meta: { changes: result.changes },
        }
      },
    })

    return {
      bind: (...values: unknown[]) => bound(values.map(toSqlite)),
      all: () => bound([]).all(),
      first: () => bound([]).first(),
      raw: () => bound([]).raw(),
      run: () => bound([]).run(),
    }
  }

  exec(query: string) {
    this.db.exec(query)

    return { count: 0, duration: 0 }
  }

  close() {
    this.db.close()
  }
}
