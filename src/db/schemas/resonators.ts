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
 * Character endpoint mirror (`character?page=1` + `character/{id}`).
 *
 * Columns follow `EncoreCharacterDetail` in
 * `src/modules/encore/domain/character.ts` field by field; the comment on each
 * column is the raw Encore JSON key. Nested collections live in their own
 * tables so the schema stays 1:1 and queryable instead of storing one opaque
 * JSON blob.
 *
 * Encore IDs are only unique per parent for nested collections (skill, passive,
 * sequence and breach IDs repeat across characters), so nested tables use an
 * autoincrement surrogate key plus a `unique(parent, encore_id)` constraint
 * and keep the original ID in its own column.
 *
 * Lore-only fields the mapper drops (`Words`, `Stories`, `Model3D`, `Skins`,
 * `SkillInputs`, ...) are intentionally not stored.
 */

/** One row per playable character (raw `roleList[]` + `character/{id}`). */
export const resonators = sqliteTable(
  "resonators",
  {
    /**
     * `Id`. Encore rows keep their API id (explicit insert); rows created from
     * the admin panel let SQLite assign one.
     */
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    /** `Name.Content` */
    name: text("name").notNull(),
    /** `Introduction.Content` */
    introduction: text("introduction").notNull().default(""),
    /** `QualityId` */
    rarity: integer("rarity", { mode: "number" }).notNull(),
    /** `ElementName` (`Element.Name` in the list endpoint) */
    element: text("element").notNull().default(""),
    /** `WeaponTypeName` (`WeaponType.Name` in the list endpoint) */
    weaponType: text("weapon_type").notNull().default(""),
    /** `RoleHeadIcon` (`images.icon`) */
    icon: text("icon").notNull().default(""),
    /** `Card` (`images.card`) */
    card: text("card").notNull().default(""),
    /** `RoleHeadIconLarge` (`images.iconLarge`) */
    iconLarge: text("icon_large").notNull().default(""),
    /** `RoleHeadIconCircle` (`images.circle`) */
    circle: text("circle").notNull().default(""),
    /** `RolePortrait` (`images.portrait`) */
    portrait: text("portrait").notNull().default(""),

    ...getDate(),
  },
  (table) => [index("resonators_element_idx").on(table.element)]
)

/** `Tags[]`: name, description, color and icon of each combat role tag. */
export const resonatorTags = sqliteTable(
  "resonator_tags",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    resonatorId: integer("resonator_id", { mode: "number" })
      .notNull()
      .references(() => resonators.id, { onDelete: "cascade" }),
    /** Position in `Tags[]`, preserves the endpoint order. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** `TagName` */
    name: text("name").notNull().default(""),
    /** `TagDesc` */
    description: text("description").notNull().default(""),
    /** `TagNameColor` */
    color: text("color").notNull().default(""),
    /** `TagIcon` */
    icon: text("icon").notNull().default(""),

    ...getDate(),
  },
  (table) => [
    index("resonator_tags_resonator_idx").on(
      table.resonatorId,
      table.sortOrder
    ),
  ]
)

/** `Properties[]`: base stats such as ATK, HP or DEF. */
export const resonatorPropertyLevels = sqliteTable(
  "resonator_property_levels",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    resonatorId: integer("resonator_id", { mode: "number" })
      .notNull()
      .references(() => resonators.id, { onDelete: "cascade" }),
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
    index("resonator_property_levels_resonator_idx").on(
      table.resonatorId,
      table.sortOrder
    ),
  ]
)

/**
 * `Properties[].GrowthValues[]`: one stat value per entry.
 *
 * Levels repeat (96 entries for a level-90 character: ascension steps share the
 * level), so `sortOrder` — not `level` — is the unique ordering key.
 *
 * `value` is a JSON number for most stats but a percentage string (`"5%"`) for
 * CRIT rate/damage, so both shapes get their own column and the original type
 * survives the round trip.
 */
export const resonatorPropertyGrowth = sqliteTable(
  "resonator_property_growth",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    propertyId: integer("property_id", { mode: "number" })
      .notNull()
      .references(() => resonatorPropertyLevels.id, { onDelete: "cascade" }),
    /** Position in `GrowthValues[]`. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** `level` */
    level: integer("level", { mode: "number" }).notNull(),
    /** `value` when the endpoint sends a number. */
    valueNumber: real("value_number"),
    /** `value` when the endpoint sends a string. */
    valueText: text("value_text"),

    ...getDate(),
  },
  (table) => [
    uniqueIndex("resonator_property_growth_property_sort_idx").on(
      table.propertyId,
      table.sortOrder
    ),
  ]
)

/** `Skills[]`: basic attack, resonance skill, liberation, intro and outro. */
export const resonatorSkills = sqliteTable(
  "resonator_skills",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    resonatorId: integer("resonator_id", { mode: "number" })
      .notNull()
      .references(() => resonators.id, { onDelete: "cascade" }),
    /** `SkillId` */
    skillId: integer("skill_id", { mode: "number" }).notNull(),
    /** Position in `Skills[]`. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** `SkillType` */
    type: text("type").notNull().default(""),
    /** `SkillName` */
    name: text("name").notNull().default(""),
    /** `SkillDescribe` */
    description: text("description").notNull().default(""),
    /** `Icon` */
    icon: text("icon").notNull().default(""),
    /** `SkillMedia` */
    media: text("media").notNull().default(""),

    ...getDate(),
  },
  (table) => [
    uniqueIndex("resonator_skills_resonator_skill_idx").on(
      table.resonatorId,
      table.skillId
    ),
  ]
)

/** `ResonantChain[]`: the six sequence nodes. */
export const resonatorSequences = sqliteTable(
  "resonator_sequences",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    resonatorId: integer("resonator_id", { mode: "number" })
      .notNull()
      .references(() => resonators.id, { onDelete: "cascade" }),
    /** `Id` */
    sequenceId: integer("sequence_id", { mode: "number" }).notNull(),
    /** Position in `ResonantChain[]`. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** `GroupIndex` */
    index: integer("index", { mode: "number" }).notNull().default(0),
    /** `NodeName` */
    name: text("name").notNull().default(""),
    /** `AttributesDescription` */
    description: text("description").notNull().default(""),

    ...getDate(),
  },
  (table) => [
    uniqueIndex("resonator_sequences_resonator_sequence_idx").on(
      table.resonatorId,
      table.sequenceId
    ),
  ]
)

/** `SkillTree[]`: inherent and stat passives. */
export const resonatorPassives = sqliteTable(
  "resonator_passives",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    resonatorId: integer("resonator_id", { mode: "number" })
      .notNull()
      .references(() => resonators.id, { onDelete: "cascade" }),
    /** `Id` */
    passiveId: integer("passive_id", { mode: "number" }).notNull(),
    /** Position in `SkillTree[]`. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** `PropertyNodeTitle` */
    title: text("title").notNull().default(""),
    /** `PropertyNodeDescribe` */
    description: text("description").notNull().default(""),
    /** `PropertyNodeIcon` */
    icon: text("icon").notNull().default(""),

    ...getDate(),
  },
  (table) => [
    uniqueIndex("resonator_passives_resonator_passive_idx").on(
      table.resonatorId,
      table.passiveId
    ),
  ]
)

/** `SkillTree[].Consume[]`: materials a passive upgrade costs. */
export const resonatorPassiveItems = sqliteTable(
  "resonator_passive_items",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    passiveId: integer("passive_id", { mode: "number" })
      .notNull()
      .references(() => resonatorPassives.id, { onDelete: "cascade" }),
    /** Position in `Consume[]`. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** `Key` (item ID) */
    key: integer("key", { mode: "number" }).notNull(),
    /** `Value` (quantity) */
    value: integer("value", { mode: "number" }).notNull(),
    /** `Icon` */
    icon: text("icon").notNull().default(""),
    /** `QualityId` */
    quality: integer("quality", { mode: "number" }).notNull().default(0),

    ...getDate(),
  },
  (table) => [
    index("resonator_passive_items_passive_idx").on(
      table.passiveId,
      table.sortOrder
    ),
  ]
)

/** `Breaches[]`: ascension breakpoints and their material list. */
export const resonatorBreaches = sqliteTable(
  "resonator_breaches",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    resonatorId: integer("resonator_id", { mode: "number" })
      .notNull()
      .references(() => resonators.id, { onDelete: "cascade" }),
    /** `Id` */
    breachId: integer("breach_id", { mode: "number" }).notNull(),
    /** Position in `Breaches[]`. */
    sortOrder: integer("sort_order", { mode: "number" }).notNull(),
    /** `BreachLevel` */
    level: integer("level", { mode: "number" }).notNull().default(0),
    /** `MaxLevel` */
    maxLevel: integer("max_level", { mode: "number" }).notNull().default(0),
    /** `Items` (passthrough, `unknown[]`). */
    items: text("items", { mode: "json" }).$type<unknown[]>().notNull(),

    ...getDate(),
  },
  (table) => [
    uniqueIndex("resonator_breaches_resonator_breach_idx").on(
      table.resonatorId,
      table.breachId
    ),
  ]
)

export type ResonatorRow = typeof resonators.$inferSelect
export type NewResonatorRow = typeof resonators.$inferInsert
export type ResonatorTagRow = typeof resonatorTags.$inferSelect
export type NewResonatorTagRow = typeof resonatorTags.$inferInsert
export type ResonatorPropertyRow = typeof resonatorPropertyLevels.$inferSelect
export type NewResonatorPropertyRow =
  typeof resonatorPropertyLevels.$inferInsert
export type ResonatorPropertyGrowthRow =
  typeof resonatorPropertyGrowth.$inferSelect
export type NewResonatorPropertyGrowthRow =
  typeof resonatorPropertyGrowth.$inferInsert
export type ResonatorSkillRow = typeof resonatorSkills.$inferSelect
export type NewResonatorSkillRow = typeof resonatorSkills.$inferInsert
export type ResonatorSequenceRow = typeof resonatorSequences.$inferSelect
export type NewResonatorSequenceRow = typeof resonatorSequences.$inferInsert
export type ResonatorPassiveRow = typeof resonatorPassives.$inferSelect
export type NewResonatorPassiveRow = typeof resonatorPassives.$inferInsert
export type ResonatorPassiveItemRow = typeof resonatorPassiveItems.$inferSelect
export type NewResonatorPassiveItemRow =
  typeof resonatorPassiveItems.$inferInsert
export type ResonatorBreachRow = typeof resonatorBreaches.$inferSelect
export type NewResonatorBreachRow = typeof resonatorBreaches.$inferInsert

export const resonatorRelations = defineRelationsPart(
  {
    resonators,
    resonatorTags,
    resonatorPropertyLevels,
    resonatorPropertyGrowth,
    resonatorSkills,
    resonatorSequences,
    resonatorPassives,
    resonatorPassiveItems,
    resonatorBreaches,
  },
  (r) => ({
    resonators: {
      tags: r.many.resonatorTags({
        from: r.resonators.id,
        to: r.resonatorTags.resonatorId,
      }),
      properties: r.many.resonatorPropertyLevels({
        from: r.resonators.id,
        to: r.resonatorPropertyLevels.resonatorId,
      }),
      skills: r.many.resonatorSkills({
        from: r.resonators.id,
        to: r.resonatorSkills.resonatorId,
      }),
      sequences: r.many.resonatorSequences({
        from: r.resonators.id,
        to: r.resonatorSequences.resonatorId,
      }),
      passives: r.many.resonatorPassives({
        from: r.resonators.id,
        to: r.resonatorPassives.resonatorId,
      }),
      breaches: r.many.resonatorBreaches({
        from: r.resonators.id,
        to: r.resonatorBreaches.resonatorId,
      }),
    },
    resonatorTags: {
      resonator: r.one.resonators({
        from: r.resonatorTags.resonatorId,
        to: r.resonators.id,
      }),
    },
    resonatorPropertyLevels: {
      resonator: r.one.resonators({
        from: r.resonatorPropertyLevels.resonatorId,
        to: r.resonators.id,
      }),
      growth: r.many.resonatorPropertyGrowth({
        from: r.resonatorPropertyLevels.id,
        to: r.resonatorPropertyGrowth.propertyId,
      }),
    },
    resonatorPropertyGrowth: {
      property: r.one.resonatorPropertyLevels({
        from: r.resonatorPropertyGrowth.propertyId,
        to: r.resonatorPropertyLevels.id,
      }),
    },
    resonatorSkills: {
      resonator: r.one.resonators({
        from: r.resonatorSkills.resonatorId,
        to: r.resonators.id,
      }),
    },
    resonatorSequences: {
      resonator: r.one.resonators({
        from: r.resonatorSequences.resonatorId,
        to: r.resonators.id,
      }),
    },
    resonatorPassives: {
      resonator: r.one.resonators({
        from: r.resonatorPassives.resonatorId,
        to: r.resonators.id,
      }),
      consume: r.many.resonatorPassiveItems({
        from: r.resonatorPassives.id,
        to: r.resonatorPassiveItems.passiveId,
      }),
    },
    resonatorPassiveItems: {
      passive: r.one.resonatorPassives({
        from: r.resonatorPassiveItems.passiveId,
        to: r.resonatorPassives.id,
      }),
    },
    resonatorBreaches: {
      resonator: r.one.resonators({
        from: r.resonatorBreaches.resonatorId,
        to: r.resonators.id,
      }),
    },
  })
)
