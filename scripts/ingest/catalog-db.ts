import { createDb, type AppDb } from "@db/create"
import { LocalD1, findLocalD1File } from "./local-d1"

/**
 * Opens the local miniflare D1 as both a Drizzle database and a raw runner.
 *
 * `db` reuses `saveCharacter` / `saveWeapon` / `saveEcho` and the relational
 * reads; `execStatements` runs the raw curation SQL documented in the skill.
 */
export interface CatalogDb {
  db: AppDb
  local: LocalD1
  file: string
}

type D1PreparedStatementLike = ReturnType<LocalD1["prepare"]>

/** Coerces the shim shape into the ambient D1 types Drizzle expects. */
function toD1Binding(local: LocalD1): D1Database {
  const binding = {
    prepare: (query: string) => local.prepare(query),
    batch: async (statements: D1PreparedStatementLike[]) => {
      const results = []

      for (const statement of statements) {
        results.push(await statement.all())
      }

      return results
    },
    exec: async (query: string) => local.exec(query),
    withSession: () => {
      throw new Error("withSession is not supported by the local D1 shim")
    },
    dump: () => {
      throw new Error("dump is not supported by the local D1 shim")
    },
  }

  return binding as unknown as D1Database
}

/** Opens the local D1 file, optionally a copy for dry runs. */
export function openLocalCatalog(
  options: { file?: string; readonly?: boolean } = {}
): CatalogDb {
  const file = options.file ?? findLocalD1File()
  const local = new LocalD1(file, { readonly: options.readonly })

  return { db: createDb(toD1Binding(local)), local, file }
}

/**
 * Runs raw SQL statements sequentially on one connection.
 *
 * Statements split on `;` at line ends to keep simple `INSERT ...;` blocks
 * readable; every statement must be parameter-free.
 */
export function execStatements(catalog: CatalogDb, sql: string): number {
  const statements = sql
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0)

  for (const statement of statements) {
    catalog.local.runStatement(statement)
  }

  return statements.length
}
