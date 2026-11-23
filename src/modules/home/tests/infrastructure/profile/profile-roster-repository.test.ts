import { createEmptyBuildPayload } from "@build/domain/build"
import { readCatalogSonataDetails } from "@catalog/infrastructure/build-catalog-details.server"
import type { AppDb } from "@db/create"
import { relations } from "@db/relations"
import { readProfileRosters } from "@home/infrastructure/profile/profile-roster-repository.server"
import { readProfileRosterCards } from "@home/infrastructure/profile/read-profile-roster-cards.server"
import { Database } from "bun:sqlite"
import { expect, test } from "bun:test"
import { drizzle } from "drizzle-orm/bun-sqlite"
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

test("scopes rosters by profile visibility and groups saved variants without drafts", async () => {
  using sqlite = new Database(":memory:")
  sqlite.exec("PRAGMA foreign_keys = ON")

  const migrations = join(import.meta.dir, "../../../../../../drizzle")
  for (const entry of readdirSync(migrations).sort()) {
    const migration = readFileSync(
      join(migrations, entry, "migration.sql"),
      "utf8"
    )
    for (const statement of migration.split("--> statement-breakpoint")) {
      if (statement.trim()) sqlite.exec(statement)
    }
  }

  sqlite.exec(`
    INSERT INTO user (id, name, email) VALUES
      ('owner', 'Rover', 'owner@example.test'),
      ('other', 'Other', 'other@example.test');
    INSERT INTO user_profiles (user_id, is_public) VALUES ('owner', 0);
    INSERT INTO resonators (id, name, rarity, icon, is_visible) VALUES
      (11, 'Carlotta', 5, '/carlotta.png', 1),
      (22, 'Changli', 5, '', 1),
      (33, 'Hidden', 5, '', 0);
    INSERT INTO builds (id, user_id, character_id, name, payload, document_version, updated_at) VALUES
      ('b', 'owner', 11, 'Variant B', '{"resonator":{"level":80}}', 2, 2000),
      ('a', 'owner', 11, 'Variant A', '{"resonator":{"level":90,"privateField":true}}', 2, 2000),
      ('c', 'owner', 22, 'Second group', '{}', 2, 1000),
      ('d', 'owner', 33, 'Hidden group', '{}', 2, 900),
      ('e', 'owner', 44, 'Missing group', 'invalid json', 2, 800),
      ('draft', 'owner', NULL, 'Draft', '{}', 2, 3000),
      ('other-build', 'other', 11, 'Other account', '{}', 2, 4000);
  `)
  const db = drizzle({ client: sqlite, relations }) as unknown as AppDb
  expect(await readCatalogSonataDetails(db)).toEqual([])

  expect(await readProfileRosters(db, "owner", undefined)).toEqual([])
  expect(await readProfileRosters(db, "owner", "other")).toEqual([])
  const ownRosters = await readProfileRosters(db, "owner", "owner")
  expect(ownRosters.map(({ characterId }) => characterId)).toEqual([
    11, 22, 33, 44,
  ])
  expect(ownRosters[0]).toEqual({
    characterId: 11,
    name: "Carlotta",
    icon: "/carlotta.png",
    builds: [
      {
        buildId: "a",
        name: "Variant A",
        level: 90,
        updatedAt: new Date(2000).toISOString(),
      },
      {
        buildId: "b",
        name: "Variant B",
        level: 80,
        updatedAt: new Date(2000).toISOString(),
      },
    ],
  })
  expect(ownRosters[3]).toMatchObject({
    name: "Resonador desconocido",
    builds: [{ buildId: "e", level: null }],
  })

  const payload = JSON.stringify({
    ...createEmptyBuildPayload(),
    notes: "This note is not displayed on the public card",
  })
  sqlite
    .query("UPDATE builds SET payload = ? WHERE id IN ('a', 'd')")
    .run(payload)
  expect(await readProfileRosterCards(db, "owner", 11, undefined)).toEqual([])
  const cards = await readProfileRosterCards(db, "owner", 11, "owner")
  expect(cards.map(({ buildId }) => buildId)).toEqual(["a"])
  expect(cards[0]).toMatchObject({
    build: { resonator: { data: { name: "Carlotta" }, level: 90 } },
    preview: { result: { stats: expect.any(Object) } },
  })
  expect(cards[0]?.build).not.toHaveProperty("userId")
  expect(JSON.stringify(cards)).not.toContain("This note")

  sqlite.exec("UPDATE user_profiles SET is_public = 1 WHERE user_id = 'owner'")
  const publicRosters = await readProfileRosters(db, "owner", undefined)
  expect(publicRosters).toEqual(ownRosters.slice(0, 2))
  expect(await readProfileRosters(db, "owner", "other")).toEqual(publicRosters)
  expect(await readProfileRosters(db, "other", undefined)).toEqual([])
  expect(await readProfileRosterCards(db, "owner", 11, undefined)).toEqual(
    cards
  )
  expect(await readProfileRosterCards(db, "owner", 33, undefined)).toEqual([])
  expect(await readProfileRosterCards(db, "owner", 33, "owner")).toHaveLength(1)
})
