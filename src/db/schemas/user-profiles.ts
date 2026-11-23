import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { user } from "@/db/schemas/auth"

/** App-owned profile settings, keyed by the authenticated account. */
export const userProfiles = sqliteTable("user_profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(false),
  gameServer: text("game_server"),
  gameUid: text("game_uid"),
  gameName: text("game_name"),
  photoUrl: text("photo_url"),
  thumbnailUrl: text("thumbnail_url"),
})
