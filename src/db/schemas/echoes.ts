import { defineRelationsPart } from "drizzle-orm"
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"
import { getDate } from "@/db/helpers/gen-date"

/**
 * Echo endpoint mirror (`echo` + `echo/{id}`).
 *
 * Columns follow `EncoreEchoDetail` in `src/modules/encore/domain/echo.ts` for
 * the mapped fields. Cosmetic, lore, star and 3D fields (element, attributes
 * description, star rating, mesh, location, zoom, animation) are dropped by the
 * mapper and are not stored here either.
 */

/** One row per echo (raw `phantomsList[]` + `echo/{id}`). */
export const echoes = sqliteTable(
  "echoes",
  {
    /** `MonsterId`, falling back to `ItemId` (the list endpoint uses `Id`). */
    id: integer("id", { mode: "number" }).primaryKey(),
    /** `MonsterName` (`Name` in the list endpoint) */
    name: text("name").notNull(),
    /** `Rarity` tier: 0 common, 1 elite, 2 boss, 3 calamity. */
    class: integer("class", { mode: "number" }).notNull().default(0),
    /** Build cost derived from the tier: 1, 3 or 4. */
    cost: integer("cost", { mode: "number" }).notNull().default(1),
    /** `Icon` */
    icon: text("icon").notNull().default(""),

    ...getDate(),
  },
  (table) => [
    index("echoes_class_idx").on(table.class),
    index("echoes_cost_idx").on(table.cost),
  ]
)

/**
 * Sonata sets of an echo: `FetterGroups[]` in the list endpoint and
 * `FetterGroupDetails[].Group` in the detail endpoint.
 */
export const echoSets = sqliteTable(
  "echo_sets",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    echoId: integer("echo_id", { mode: "number" })
      .notNull()
      .references(() => echoes.id, { onDelete: "cascade" }),
    /** Position in `FetterGroups[]` / `FetterGroupDetails[]`. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** `Id` (`Group.Id` in the detail endpoint) */
    setId: integer("set_id", { mode: "number" }).notNull().default(0),
    /** `Name` (`Group.FetterGroupName` in the detail endpoint) */
    name: text("name").notNull().default(""),
    /** `Icon` (only present in the list endpoint). */
    icon: text("icon").notNull().default(""),

    ...getDate(),
  },
  (table) => [
    uniqueIndex("echo_sets_echo_set_idx").on(table.echoId, table.setId),
    index("echo_sets_set_idx").on(table.setId),
  ]
)

/**
 * `FetterGroups[].Fetters[]` / `FetterDetails[].EffectDescriptions[]`: the
 * 2-piece and 5-piece sonata bonuses.
 */
export const echoSetEffects = sqliteTable(
  "echo_set_effects",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    setId: integer("set_id", { mode: "number" })
      .notNull()
      .references(() => echoSets.id, { onDelete: "cascade" }),
    /** Position in `Fetters[]` / `EffectDescriptions[]`. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** `Key`: 2 or 5 pieces. */
    key: integer("key", { mode: "number" }).notNull(),
    /** `EffectDescription` */
    description: text("description").notNull().default(""),

    ...getDate(),
  },
  (table) => [
    index("echo_set_effects_set_idx").on(table.setId, table.sortOrder),
  ]
)

/** `Skill`: the echo active skill (one per echo). */
export const echoSkills = sqliteTable("echo_skills", {
  echoId: integer("echo_id", { mode: "number" })
    .primaryKey()
    .references(() => echoes.id, { onDelete: "cascade" }),
  /** `DescriptionEx`, falling back to `SimplyDescription`. */
  description: text("description").notNull().default(""),
  /** `SkillCD` */
  cooldown: real("cooldown").notNull().default(0),
  /** `DamageList` (passthrough, `unknown[]`). */
  damage: text("damage", { mode: "json" }).$type<unknown[]>().notNull(),

  ...getDate(),
})

export type EchoRow = typeof echoes.$inferSelect
export type NewEchoRow = typeof echoes.$inferInsert
export type EchoSetRow = typeof echoSets.$inferSelect
export type NewEchoSetRow = typeof echoSets.$inferInsert
export type EchoSetEffectRow = typeof echoSetEffects.$inferSelect
export type NewEchoSetEffectRow = typeof echoSetEffects.$inferInsert
export type EchoSkillRow = typeof echoSkills.$inferSelect
export type NewEchoSkillRow = typeof echoSkills.$inferInsert

export const echoRelations = defineRelationsPart(
  { echoes, echoSets, echoSetEffects, echoSkills },
  (r) => ({
    echoes: {
      sets: r.many.echoSets({
        from: r.echoes.id,
        to: r.echoSets.echoId,
      }),
      skill: r.one.echoSkills({
        from: r.echoes.id,
        to: r.echoSkills.echoId,
      }),
    },
    echoSets: {
      echo: r.one.echoes({
        from: r.echoSets.echoId,
        to: r.echoes.id,
      }),
      effects: r.many.echoSetEffects({
        from: r.echoSets.id,
        to: r.echoSetEffects.setId,
      }),
    },
    echoSetEffects: {
      set: r.one.echoSets({
        from: r.echoSetEffects.setId,
        to: r.echoSets.id,
      }),
    },
    echoSkills: {
      echo: r.one.echoes({
        from: r.echoSkills.echoId,
        to: r.echoes.id,
      }),
    },
  })
)
