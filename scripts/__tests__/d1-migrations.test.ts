/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  listMigrations,
  pendingMigrations,
  readWranglerDatabase,
  splitStatements,
  type Migration,
} from "@/../scripts/d1-migrations"

const migration = (name: string): Migration => ({
  name,
  path: `drizzle/${name}/migration.sql`,
  sql: "",
  hasSnapshot: true,
})

describe("listMigrations", () => {
  test("returns every generated migration in timestamp order", () => {
    const migrations = listMigrations()

    expect(migrations.length).toBeGreaterThan(0)
    expect(migrations.map((item) => item.name)).toEqual(
      [...migrations.map((item) => item.name)].sort()
    )
  })

  test("reads the SQL of each migration folder", () => {
    for (const item of listMigrations()) {
      expect(item.sql.trim().length).toBeGreaterThan(0)
    }
  })

  test("keeps a drizzle snapshot next to every migration", () => {
    const missing = listMigrations().filter((item) => !item.hasSnapshot)

    expect(missing.map((item) => item.name)).toEqual([])
  })
})

describe("splitStatements", () => {
  test("splits on the drizzle separator and trims each statement", () => {
    const sql = [
      "ALTER TABLE `a` ADD `b` integer;",
      "--> statement-breakpoint",
      "  DROP INDEX IF EXISTS `c`;  ",
      "--> statement-breakpoint",
      "",
    ].join("\r\n")

    expect(splitStatements(sql)).toEqual([
      "ALTER TABLE `a` ADD `b` integer;",
      "DROP INDEX IF EXISTS `c`;",
    ])
  })

  test("keeps a single statement untouched", () => {
    expect(splitStatements("DROP COLUMN `x`;")).toEqual(["DROP COLUMN `x`;"])
  })
})

describe("pendingMigrations", () => {
  const all = [
    migration("1_first"),
    migration("2_second"),
    migration("3_third"),
  ]

  test("returns every migration when nothing was applied", () => {
    expect(pendingMigrations(all, [])).toEqual(all)
  })

  test("skips the applied migrations and keeps the order", () => {
    expect(pendingMigrations(all, ["1_first", "3_third"])).toEqual([
      migration("2_second"),
    ])
  })

  test("returns nothing when the database is up to date", () => {
    expect(pendingMigrations(all, ["1_first", "2_second", "3_third"])).toEqual(
      []
    )
  })
})

describe("readWranglerDatabase", () => {
  test("reads the D1 binding from wrangler.jsonc", () => {
    expect(readWranglerDatabase()).toEqual({
      name: "wuwa-builds-db",
      id: "e28ea5a8-addd-4157-a8ee-b38000989034",
    })
  })
})
