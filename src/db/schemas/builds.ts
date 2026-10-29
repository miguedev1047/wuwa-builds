import { defineRelationsPart, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import type { BuildPayload } from "../../modules/builds/domain/build"
import { user } from "./auth-schema"

/**
 * One row per saved build. Several rows may share (userId, characterId):
 * "my builds" groups them by character, but the build ID is the identity.
 */
export const builds = sqliteTable(
  "builds",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** Numeric Encore character ID. */
    characterId: integer("character_id").notNull(),
    name: text("name").notNull(),
    payload: text("payload", { mode: "json" }).$type<BuildPayload>().notNull(),
    documentVersion: integer("document_version").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("builds_user_character_idx").on(
      table.userId,
      table.characterId,
      table.updatedAt,
    ),
    index("builds_user_updated_idx").on(table.userId, table.updatedAt),
  ],
)

export type BuildRow = typeof builds.$inferSelect
export type NewBuildRow = typeof builds.$inferInsert

export const buildsRelations = defineRelationsPart({ user, builds }, (r) => ({
  user: {
    builds: r.many.builds({
      from: r.user.id,
      to: r.builds.userId,
    }),
  },
  builds: {
    user: r.one.user({
      from: r.builds.userId,
      to: r.user.id,
    }),
  },
}))
