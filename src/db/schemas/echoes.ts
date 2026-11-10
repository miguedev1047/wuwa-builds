import { defineRelationsPart } from "drizzle-orm"
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"
import { getDate } from "@db/helpers/gen-date"

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

/** `Skill`: the echo active skill text (one per echo). */
export const echoSkills = sqliteTable("echo_skills", {
  echoId: integer("echo_id", { mode: "number" })
    .primaryKey()
    .references(() => echoes.id, { onDelete: "cascade" }),
  /** `DescriptionEx` */
  description: text("description").notNull().default(""),
  /** `SimplyDescription` */
  simpleDescription: text("simple_description").notNull().default(""),
  /** `BattleViewIcon` */
  icon: text("icon").notNull().default(""),

  ...getDate(),
})

/**
 * Stat bonuses the echo skill grants, curated by the admin.
 *
 * Encore only sends them as prose (`BuffIds` and `BuffEffects` are empty), so
 * the stat, the amount and the condition are entered here. `condition` tells
 * the builder whether it can add the value to a static sheet: `combat` cannot,
 * `resonator`/`element`/`weaponType` can, and `requiresMainSlot` narrows any of
 * them to the active slot.
 */
export const echoSkillBonuses = sqliteTable(
  "echo_skill_bonuses",
  {
    id: integer("id", { mode: "number" }).primaryKey({
      autoIncrement: true,
    }),
    echoId: integer("echo_id", { mode: "number" })
      .notNull()
      .references(() => echoes.id, { onDelete: "cascade" }),
    /** Canonical builder stat key. */
    statId: text("stat_id").notNull(),
    /** Bonus amount in percent. */
    value: real("value").notNull().default(0),
    /** Only applies to the echo equipped in the main slot. */
    requiresMainSlot: integer("requires_main_slot", { mode: "boolean" })
      .notNull()
      .default(false),
    /**
     * `none`, `resonator`, `element`, `weaponType` or `combat`. The first four
     * are computable; `combat` is a trigger the builder only displays.
     */
    condition: text("condition").notNull().default("none"),
    /** Character id, element id or weapon type id, depending on `condition`. */
    conditionValue: text("condition_value"),
    sortOrder: integer("sort_order", { mode: "number" }).notNull().default(0),

    ...getDate(),
  },
  (table) => [
    index("echo_skill_bonuses_echo_sort_idx").on(table.echoId, table.sortOrder),
  ]
)

/**
 * Sonata sets as a first class catalog (`FetterGroupDetails[].Group`).
 *
 * The piece threshold lives on the effects, because a set can trigger at 1, 2,
 * 3 or 5 pieces: `sonata_set_effects.pieces` holds it and `is_conditional`
 * tells the builder whether the bonus can be added to a static stat sheet.
 */
export const sonataSets = sqliteTable("sonata_sets", {
  /** `Group.Id` from Encore, typed by hand for manual sets. */
  id: integer("id", { mode: "number" }).primaryKey(),
  /** `Group.FetterGroupName` */
  name: text("name").notNull(),
  /** `Fetters[].Icon` from the list endpoint, or `Group.FetterElementPath`. */
  icon: text("icon").notNull().default(""),
  /** `Group.FetterElementColor`, kept for the panel accent. */
  color: text("color").notNull().default(""),
  /**
   * `encore` rows are refreshed by the sync; `manual` rows are created by the
   * admin and never touched by it.
   */
  source: text("source").notNull().default("encore"),

  ...getDate(),
})

/** One row per piece threshold of a sonata set. */
export const sonataSetEffects = sqliteTable(
  "sonata_set_effects",
  {
    id: integer("id", { mode: "number" }).primaryKey({
      autoIncrement: true,
    }),
    setId: integer("set_id", { mode: "number" })
      .notNull()
      .references(() => sonataSets.id, { onDelete: "cascade" }),
    /** Pieces needed to trigger the bonus: 1, 2, 3 or 5. */
    pieces: integer("pieces", { mode: "number" }).notNull(),
    /** `EffectDescriptions[]`, already resolved by the detail endpoint. */
    description: text("description").notNull().default(""),
    /**
     * Combat-only bonus. When `false` the builder adds `statId` + `value` to
     * the static sheet; when `true` it only shows the description.
     */
    isConditional: integer("is_conditional", { mode: "boolean" })
      .notNull()
      .default(true),
    /** Canonical builder key, only set on static effects. */
    statId: text("stat_id"),
    /** Bonus amount in percent, only set on static effects. */
    value: real("value"),
    /** Position inside the set. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull().default(0),

    ...getDate(),
  },
  (table) => [
    uniqueIndex("sonata_set_effects_set_pieces_idx").on(
      table.setId,
      table.pieces
    ),
  ]
)

export type EchoRow = typeof echoes.$inferSelect
export type NewEchoRow = typeof echoes.$inferInsert
export type EchoSetRow = typeof echoSets.$inferSelect
export type NewEchoSetRow = typeof echoSets.$inferInsert
export type EchoSkillRow = typeof echoSkills.$inferSelect
export type NewEchoSkillRow = typeof echoSkills.$inferInsert
export type EchoSkillBonusRow = typeof echoSkillBonuses.$inferSelect
export type NewEchoSkillBonusRow = typeof echoSkillBonuses.$inferInsert
export type SonataSetRow = typeof sonataSets.$inferSelect
export type NewSonataSetRow = typeof sonataSets.$inferInsert
export type SonataSetEffectRow = typeof sonataSetEffects.$inferSelect
export type NewSonataSetEffectRow = typeof sonataSetEffects.$inferInsert

export const echoRelations = defineRelationsPart(
  { echoes, echoSets, sonataSetEffects, echoSkills, echoSkillBonuses },
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
      skillBonuses: r.many.echoSkillBonuses({
        from: r.echoes.id,
        to: r.echoSkillBonuses.echoId,
      }),
    },
    echoSets: {
      echo: r.one.echoes({
        from: r.echoSets.echoId,
        to: r.echoes.id,
      }),
      sonataEffects: r.many.sonataSetEffects({
        from: r.echoSets.setId,
        to: r.sonataSetEffects.setId,
      }),
    },
    echoSkills: {
      echo: r.one.echoes({
        from: r.echoSkills.echoId,
        to: r.echoes.id,
      }),
    },
    echoSkillBonuses: {
      echo: r.one.echoes({
        from: r.echoSkillBonuses.echoId,
        to: r.echoes.id,
      }),
    },
  })
)

export const sonataRelations = defineRelationsPart(
  { sonataSets, sonataSetEffects },
  (r) => ({
    sonataSets: {
      effects: r.many.sonataSetEffects({
        from: r.sonataSets.id,
        to: r.sonataSetEffects.setId,
      }),
    },
    sonataSetEffects: {
      set: r.one.sonataSets({
        from: r.sonataSetEffects.setId,
        to: r.sonataSets.id,
      }),
    },
  })
)
