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
 * Weapon endpoint mirror (`weapon?page=1` + `weapon/{id}`).
 *
 * Columns follow `EncoreWeaponDetail` in `src/modules/encore/domain/weapon.ts`
 * field by field; the comment on each column is the raw Encore JSON key.
 * Model, mesh and stand-animation fields are dropped by the mapper and are not
 * stored here either.
 *
 * Encore sends the passive as one `Desc` template with slash-separated values
 * per rank (`"12%/15%/18%/21%/24%"`); the mapper expands it into one
 * `weapon_refinements` row per rank (1 to 5). Ascension `Breaches[]` are not
 * stored.
 */

/** One row per weapon (raw `weapons[]` + `weapon/{id}`). */
export const weapons = sqliteTable(
  "weapons",
  {
    /** `ItemId` (`Id` in the list endpoint) */
    id: integer("id", { mode: "number" }).primaryKey(),
    /** `WeaponName` (`Name` in the list endpoint) */
    name: text("name").notNull(),
    /** `QualityId` */
    rarity: integer("rarity", { mode: "number" }).notNull().default(0),
    /** `WeaponType` (`Type` in the list endpoint) */
    type: integer("type", { mode: "number" }).notNull().default(0),
    /** `WeaponTypeName` (`TypeName` in the list endpoint) */
    typeName: text("type_name").notNull().default(""),
    /** `Icon` */
    icon: text("icon").notNull().default(""),
    /** `AttributesDescription` (falls back to `BgDescription`). */
    description: text("description").notNull().default(""),

    ...getDate(),
  },
  (table) => [index("weapons_type_idx").on(table.type)]
)

/** `Properties[]`: the weapon base stats (usually ATK plus a substat). */
export const weaponProperties = sqliteTable(
  "weapon_properties",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    weaponId: integer("weapon_id", { mode: "number" })
      .notNull()
      .references(() => weapons.id, { onDelete: "cascade" }),
    /** Position in `Properties[]`. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** Canonical stat id (`atk`, `crit_rate`, ...), not the Encore label. */
    name: text("name").notNull().default(""),
    /** `Icon` */
    icon: text("icon").notNull().default(""),
    /** `BaseValue` */
    baseValue: real("base_value").notNull().default(0),

    ...getDate(),
  },
  (table) => [
    index("weapon_properties_weapon_idx").on(table.weaponId, table.sortOrder),
  ]
)

/**
 * `Properties[].GrowthValues[]`.
 *
 * Weapon values arrive as strings (`"4.2%"`), so the text column is the one
 * that is normally populated; `valueNumber` keeps the round trip exact if a
 * weapon ever reports a numeric value.
 */
export const weaponPropertyGrowth = sqliteTable(
  "weapon_property_growth",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    propertyId: integer("property_id", { mode: "number" })
      .notNull()
      .references(() => weaponProperties.id, { onDelete: "cascade" }),
    /** Position in `GrowthValues[]`. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** `Level` (fallback `level`) */
    level: integer("level", { mode: "number" }).notNull(),
    /** `Value` (fallback `value`) when the endpoint sends a number. */
    valueNumber: real("value_number"),
    /** `Value` (fallback `value`) when the endpoint sends a string, verbatim. */
    valueText: text("value_text"),

    ...getDate(),
  },
  (table) => [
    uniqueIndex("weapon_property_growth_property_sort_idx").on(
      table.propertyId,
      table.sortOrder
    ),
  ]
)

/**
 * `ResonName` + `Desc`: one row per refinement rank.
 *
 * Every weapon has five ranks (1 to 5). The mapper expands the `Desc` template
 * into a concrete effect per rank, so each row stores the text a rank actually
 * shows instead of the whole `"a/b/c/d/e"` list.
 */
export const weaponRefinements = sqliteTable(
  "weapon_refinements",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    weaponId: integer("weapon_id", { mode: "number" })
      .notNull()
      .references(() => weapons.id, { onDelete: "cascade" }),
    /**
     * Refinement rank, 1 to 5. It doubles as the ordering key, so a refinement
     * is always selected by its rank and never by array position.
     */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** `ResonName`: the passive title, shared by the five ranks. */
    name: text("name").notNull().default(""),
    /** `Desc` with this rank's values substituted. */
    effect: text("effect").notNull().default(""),

    ...getDate(),
  },
  (table) => [
    uniqueIndex("weapon_refinements_weapon_sort_idx").on(
      table.weaponId,
      table.sortOrder
    ),
  ]
)

/**
 * Stats granted by one refinement rank.
 *
 * The builder adds these values on top of the weapon base stats, so the table
 * is authored by hand: Encore only carries prose, and a passive such as
 * "Max HP +12%/15%/18%/21%/24%" must reach the final HP calculation as a real
 * number. `saveWeapon` never derives these rows from the API and preserves them
 * when a weapon is re-synced.
 */
export const weaponRefinementStats = sqliteTable(
  "weapon_refinement_stats",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    refinementId: integer("refinement_id", { mode: "number" })
      .notNull()
      .references(() => weaponRefinements.id, { onDelete: "cascade" }),
    /** Position inside the refinement's stat list. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** Canonical stat id (`atk`, `crit_rate`, ...) the builder sums. */
    statName: text("stat_name").notNull().default(""),
    /** Amount as the game shows it, e.g. `20` for +20%. */
    statNumber: real("stat_number").notNull().default(0),

    ...getDate(),
  },
  (table) => [
    uniqueIndex("weapon_refinement_stats_refinement_sort_idx").on(
      table.refinementId,
      table.sortOrder
    ),
  ]
)

export type WeaponRow = typeof weapons.$inferSelect
export type NewWeaponRow = typeof weapons.$inferInsert
export type WeaponPropertyRow = typeof weaponProperties.$inferSelect
export type NewWeaponPropertyRow = typeof weaponProperties.$inferInsert
export type WeaponPropertyGrowthRow = typeof weaponPropertyGrowth.$inferSelect
export type NewWeaponPropertyGrowthRow =
  typeof weaponPropertyGrowth.$inferInsert
export type WeaponRefinementRow = typeof weaponRefinements.$inferSelect
export type NewWeaponRefinementRow = typeof weaponRefinements.$inferInsert
export type WeaponRefinementStatRow = typeof weaponRefinementStats.$inferSelect
export type NewWeaponRefinementStatRow =
  typeof weaponRefinementStats.$inferInsert

export const weaponRelations = defineRelationsPart(
  {
    weapons,
    weaponProperties,
    weaponPropertyGrowth,
    weaponRefinements,
    weaponRefinementStats,
  },
  (r) => ({
    weapons: {
      properties: r.many.weaponProperties({
        from: r.weapons.id,
        to: r.weaponProperties.weaponId,
      }),
      refinements: r.many.weaponRefinements({
        from: r.weapons.id,
        to: r.weaponRefinements.weaponId,
      }),
    },
    weaponProperties: {
      weapon: r.one.weapons({
        from: r.weaponProperties.weaponId,
        to: r.weapons.id,
      }),
      growth: r.many.weaponPropertyGrowth({
        from: r.weaponProperties.id,
        to: r.weaponPropertyGrowth.propertyId,
      }),
    },
    weaponPropertyGrowth: {
      property: r.one.weaponProperties({
        from: r.weaponPropertyGrowth.propertyId,
        to: r.weaponProperties.id,
      }),
    },
    weaponRefinements: {
      weapon: r.one.weapons({
        from: r.weaponRefinements.weaponId,
        to: r.weapons.id,
      }),
      stats: r.many.weaponRefinementStats({
        from: r.weaponRefinements.id,
        to: r.weaponRefinementStats.refinementId,
      }),
    },
    weaponRefinementStats: {
      refinement: r.one.weaponRefinements({
        from: r.weaponRefinementStats.refinementId,
        to: r.weaponRefinements.id,
      }),
    },
  })
)
