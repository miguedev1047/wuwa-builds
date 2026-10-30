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
    /** `Desc` (the passive effect text). */
    effect: text("effect").notNull().default(""),

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
    /** `Name` */
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

/** `Breaches[]`: ascension breakpoints and their material list. */
export const weaponBreaches = sqliteTable(
  "weapon_breaches",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    weaponId: integer("weapon_id", { mode: "number" })
      .notNull()
      .references(() => weapons.id, { onDelete: "cascade" }),
    /** `Id` */
    breachId: integer("breach_id", { mode: "number" }).notNull(),
    /** Position in `Breaches[]`. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** `Level` */
    level: integer("level", { mode: "number" }).notNull().default(0),
    /** `LevelLimit` */
    levelLimit: integer("level_limit", { mode: "number" }).notNull().default(0),
    /** `Items` (passthrough, `unknown[]`). */
    items: text("items", { mode: "json" }).$type<unknown[]>().notNull(),

    ...getDate(),
  },
  (table) => [
    uniqueIndex("weapon_breaches_weapon_breach_idx").on(
      table.weaponId,
      table.breachId
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
export type WeaponBreachRow = typeof weaponBreaches.$inferSelect
export type NewWeaponBreachRow = typeof weaponBreaches.$inferInsert

export const weaponRelations = defineRelationsPart(
  { weapons, weaponProperties, weaponPropertyGrowth, weaponBreaches },
  (r) => ({
    weapons: {
      properties: r.many.weaponProperties({
        from: r.weapons.id,
        to: r.weaponProperties.weaponId,
      }),
      breaches: r.many.weaponBreaches({
        from: r.weapons.id,
        to: r.weaponBreaches.weaponId,
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
    weaponBreaches: {
      weapon: r.one.weapons({
        from: r.weaponBreaches.weaponId,
        to: r.weapons.id,
      }),
    },
  })
)
