/// <reference types="bun" />

import { Database } from "bun:sqlite"
import { beforeEach, describe, expect, test } from "bun:test"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/bun-sqlite"
import type { AppDb } from "@/db/create"
import { relations } from "@/db/relations"
import {
  resonators,
  resonatorsMedia,
  sonataSetEffects,
  sonataSets,
  weaponRefinementStats,
  weapons,
} from "@/db/schema"
import { numberConverter } from "@/lib/number-converter"
import type { EncoreCharacterDetail } from "@/modules/encore/domain/character"
import type { EncoreWeaponDetail } from "@/modules/encore/domain/weapon"
import {
  toCharacterDetail,
  toEchoDetail,
  toWeaponDetail,
  type RawCharacterDetail,
  type RawEchoDetail,
  type RawWeaponDetail,
} from "../infrastructure/mapper.server"
import {
  readCharacter,
  readCharacters,
  readEcho,
  readEchoes,
  readWeapon,
  readWeapons,
  saveCharacter,
  saveEcho,
  saveWeapon,
} from "./catalog-d1.server"

const MIGRATIONS_DIR = join(import.meta.dir, "../../../../drizzle")

/**
 * Applies every generated migration to a throwaway in-memory SQLite database.
 * Using the real migration SQL keeps the test honest: it fails if the drizzle
 * schema and the migrations ever drift apart.
 */
function createTestDb(): AppDb {
  const sqlite = new Database(":memory:")
  sqlite.exec("PRAGMA foreign_keys = ON")

  for (const entry of readdirSync(MIGRATIONS_DIR).sort()) {
    const file = join(MIGRATIONS_DIR, entry, "migration.sql")
    const migration = readFileSync(file, "utf8")

    for (const statement of migration.split("--> statement-breakpoint")) {
      if (statement.trim()) sqlite.exec(statement)
    }
  }

  return drizzle({ client: sqlite, relations }) as unknown as AppDb
}

/** Trimmed but structurally faithful `character/{id}` response. */
const rawCharacter: RawCharacterDetail = {
  Id: 1402,
  Name: { Title: "Yangyang", Content: "Yangyang" },
  Introduction: { Title: "Introducción", Content: "Introducción" },
  QualityId: 4,
  ElementName: "Aero",
  WeaponTypeName: "Espada",
  Card: "https://api.encore.moe/resource/Data/Game/Aki/UI/Image/card.webp",
  RoleHeadIcon:
    "https://api.encore.moe/resource/Data/Game/Aki/UI/Image/icon.webp",
  RoleHeadIconLarge:
    "https://api.encore.moe/resource/Data/Game/Aki/UI/Image/icon-large.webp",
  RoleHeadIconCircle:
    "https://api.encore.moe/resource/Data/Game/Aki/UI/Image/circle.webp",
  RolePortrait: "portrait.webp",
  Tags: [
    {
      TagName: "Curación",
      TagDesc: "Cura al equipo",
      TagNameColor: "#5ac8fa",
      TagIcon: "tag.webp",
    },
  ],
  Properties: [
    {
      Name: "PS",
      Icon: "hp.webp",
      BaseValue: 816,
      GrowthValues: [
        { growthId: 1, level: 1, value: 816 },
        { growthId: 2, level: 20, value: 884.7072 },
        { growthId: 3, level: 20, value: 953.496 },
      ],
    },
    {
      // CRIT stats report percentage strings instead of numbers.
      Name: "Prob. CRIT",
      Icon: "crit.webp",
      BaseValue: 5,
      GrowthValues: [
        { growthId: 1, level: 1, value: "5%" },
        { growthId: 2, level: 1, value: "5.2%" },
      ],
    },
  ],
  Skills: [
    {
      SkillId: 140201,
      SkillType: "Ataque normal",
      SkillName: "Ataque normal",
      SkillDescribe: "Descripción",
      Icon: "skill.webp",
      SkillMedia: "skill.mp4",
      SkillAttributes: [
        {
          attributeId: 1,
          attributeName: "Nv.1",
          values: ["10%", "20%"],
          Description: "atributo",
        },
        { attributeId: 2, attributeName: "Nv.2", values: ["11%"] },
      ],
      Consumes: [{ SkillId: 1, Consume: [] }],
      DamageList: [{ EntryNumber: 1, Id: 1, Type: "Normal", DmgType: "Aero" }],
    },
  ],
  ResonantChain: [
    {
      Id: 140201001,
      GroupIndex: 1,
      NodeName: "Nodo",
      AttributesDescription: "Descripción del nodo",
    },
  ],
  SkillTree: [
    {
      Id: 155,
      PropertyNodeTitle: "ATQ+",
      PropertyNodeDescribe: "ATQ +1.80%",
      PropertyNodeIcon: "passive.webp",
      Consume: [{ Key: 43020013, Value: 3, Icon: "item.webp", QualityId: 4 }],
    },
  ],
  Breaches: [
    { Id: 46, BreachLevel: 0, MaxLevel: 20, Items: [{ Key: 1, Value: 2 }] },
    { Id: 47, BreachLevel: 1, MaxLevel: 40, Items: [] },
  ],
}

/** Highlighted span Encore uses to pack the five refinement values. */
const highlighted = 'style="color:#ffd12f;" class="font-bold"'

/** Trimmed but structurally faithful `weapon/{id}` response. */
const rawWeapon: RawWeaponDetail = {
  ItemId: 21010074,
  WeaponName: "Rastro de otoño",
  QualityId: 4,
  WeaponType: 1,
  WeaponTypeName: "Mandoble",
  // Weapon detail endpoints send Unreal asset paths (`Package.Object`).
  Icon: "/Game/Aki/UI/Image/IconWeapon/weapon.weapon",
  ResonName: "Dirección del filo",
  Desc: `Aumenta el ATQ un <span ${highlighted}>4%/6.2%/8.4%/10.6%/12.8%</span> al infligir Daño de Ataque básico.`,
  AttributesDescription: "ATQ 500",
  BgDescription: "Lore del arma",
  Properties: [
    {
      Name: "ATQ",
      Icon: "atk.webp",
      BaseValue: 500,
      GrowthValues: [
        { Level: 1, Value: "500" },
        { Level: 2, Value: "513.6" },
      ],
    },
  ],
}

/** The `Desc` template expanded per rank: only the highlighted value changes. */
const weaponRefinementEffects = ["4%", "6.2%", "8.4%", "10.6%", "12.8%"].map(
  (value) =>
    `Aumenta el ATQ un <span ${highlighted}>${value}</span> al infligir Daño de Ataque básico.`
)

/** Trimmed but structurally faithful `echo/{id}` response. */
const rawEcho: RawEchoDetail = {
  MonsterId: 6000038,
  ItemId: 6000039,
  MonsterName: "Campemico",
  Rarity: 1,
  Icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/Image/echo.webp",
  Element: { Name: "Aero" },
  AttributesDescription: "Descripción del eco",
  Skill: {
    DescriptionEx: "Habilidad del eco",
    SimplyDescription: "Resumen del eco",
    BattleViewIcon:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/Image/skill.webp",
  },
  FetterGroupDetails: [
    { Group: { Id: 9, FetterGroupName: "Melodías perdurables" } },
  ],
  FetterDetails: {
    "Melodías perdurables": { EffectDescriptions: ["2 piezas", "5 piezas"] },
  },
}

/** The D1 document no longer stores skill or passive details. */
function withoutDroppedDetails(
  character: EncoreCharacterDetail
): EncoreCharacterDetail {
  return {
    ...character,
    skills: character.skills.map((skill) => ({
      ...skill,
      attributes: [],
      consumes: [],
      damage: [],
    })),
    passives: character.passives.map((passive) => ({
      ...passive,
      description: String(numberConverter({ input: passive.description })),
      consume: [],
    })),
    breaches: [],
  }
}

describe("encore catalog schema", () => {
  let db: AppDb

  beforeEach(() => {
    db = createTestDb()
  })

  /**
   * Sonata effects now live in the canonical `sonata_set_effects`, so the echo
   * reads resolve them through `echo_sets.set_id` instead of a per-echo copy.
   */
  async function seedSonataSet() {
    await db.insert(sonataSets).values({
      id: 9,
      name: "Melodías perdurables",
      source: "encore",
    })
    await db.insert(sonataSetEffects).values([
      {
        setId: 9,
        pieces: 2,
        description: "2 piezas",
        isConditional: false,
        statId: "atk_percent",
        value: 10,
        sortOrder: 0,
      },
      {
        setId: 9,
        pieces: 5,
        description: "5 piezas",
        isConditional: true,
        sortOrder: 1,
      },
    ])
  }

  test("round-trips a character + weapon + echo without losing fields", async () => {
    const character = toCharacterDetail(rawCharacter)
    const weapon = toWeaponDetail(rawWeapon)
    const echo = toEchoDetail(rawEcho)

    await seedSonataSet()
    await saveCharacter(db, character)
    await saveWeapon(db, weapon)
    await saveEcho(db, echo)

    expect(await readCharacter(db, character.id)).toEqual(
      withoutDroppedDetails(character)
    )
    expect(await readWeapon(db, weapon.id)).toEqual(weapon)
    expect(await readEcho(db, echo.id)).toEqual(echo)
  })

  test("maps the Encore tier to the echo class and cost", () => {
    expect(toEchoDetail(rawEcho)).toMatchObject({ class: 1, cost: 3 })
    expect(toEchoDetail({ ...rawEcho, Rarity: 0 })).toMatchObject({
      class: 0,
      cost: 1,
    })
    expect(toEchoDetail({ ...rawEcho, Rarity: 3 })).toMatchObject({
      class: 3,
      cost: 4,
    })
  })

  test("drops the element and the attributes description of an echo", () => {
    const echo = toEchoDetail(rawEcho)

    expect(echo).not.toHaveProperty("element")
    expect(echo).not.toHaveProperty("description")
    expect(echo).not.toHaveProperty("rarity")
  })

  test("rebuilds the list endpoints from the detail rows", async () => {
    await seedSonataSet()
    await saveCharacter(db, toCharacterDetail(rawCharacter))
    await saveWeapon(db, toWeaponDetail(rawWeapon))
    await saveEcho(db, toEchoDetail(rawEcho))

    expect(await readCharacters(db)).toMatchObject([
      {
        id: 1402,
        name: "Yangyang",
        rarity: 4,
        element: "Aero",
        weaponType: "Espada",
        icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/Image/icon.webp",
        iconLarge:
          "https://api.encore.moe/resource/Data/Game/Aki/UI/Image/icon-large.webp",
      },
    ])

    expect(await readWeapons(db)).toEqual([
      {
        id: 21010074,
        name: "Rastro de otoño",
        rarity: 4,
        type: 1,
        typeName: "Mandoble",
        // The Unreal asset path stored by Encore becomes a fetchable URL.
        icon: "https://api-v2.encore.moe/resource/Data/Game/Aki/UI/Image/IconWeapon/weapon.webp",
      },
    ])

    expect(await readEchoes(db)).toEqual([
      {
        id: 6000038,
        name: "Campemico",
        class: 1,
        cost: 3,
        icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/Image/echo.webp",
        sets: [
          {
            id: 9,
            name: "Melodías perdurables",
            icon: "",
            effects: [
              { key: 2, description: "2 piezas" },
              { key: 5, description: "5 piezas" },
            ],
          },
        ],
      },
    ])
  })

  test("stores the character images as media rows", async () => {
    const character = toCharacterDetail(rawCharacter)
    await saveCharacter(db, character)

    const media = await db
      .select()
      .from(resonatorsMedia)
      .orderBy(resonatorsMedia.sortOrder)

    expect(media.map((row) => [row.kind, row.url])).toEqual([
      ["card", character.images.card],
      ["icon", character.images.icon],
      ["iconLarge", character.images.iconLarge],
      ["circle", character.images.circle],
      ["portrait", character.images.portrait],
    ])
  })

  test("reads the edited media URL instead of the mirrored column", async () => {
    const character = toCharacterDetail(rawCharacter)
    await saveCharacter(db, character)

    await db
      .update(resonatorsMedia)
      .set({ url: "https://example.com/portrait.png" })
      .where(eq(resonatorsMedia.kind, "portrait"))

    expect((await readCharacter(db, character.id))?.images.portrait).toBe(
      "https://example.com/portrait.png"
    )
  })

  test("re-saving replaces child rows instead of duplicating them", async () => {
    const character = toCharacterDetail(rawCharacter)
    await saveCharacter(db, character)
    await saveCharacter(db, character)

    const stored = await readCharacter(db, character.id)
    expect(stored?.skills).toHaveLength(1)
    expect(stored?.skills[0].attributes).toEqual([])
    expect(stored?.properties[0].growth).toHaveLength(3)
    expect(stored?.passives[0].consume).toEqual([])
    expect(stored?.passives[0].description).toBe("1.8")
    expect(stored?.breaches).toEqual([])
    expect(stored?.tags).toHaveLength(1)
    expect(stored?.sequences).toHaveLength(1)
    expect(await db.select().from(resonatorsMedia)).toHaveLength(5)
  })

  test("keeps colliding nested ids from different characters apart", async () => {
    // Encore reuses skill, passive, sequence and breach ids across characters,
    // so those tables key on the surrogate row id, not the raw Encore id.
    const second: RawCharacterDetail = {
      ...rawCharacter,
      Id: 1210,
      Name: { Title: "Otro", Content: "Otro" },
    }

    const first = toCharacterDetail(rawCharacter)
    const other = toCharacterDetail(second)

    expect(other.skills[0].id).toBe(first.skills[0].id)
    expect(other.passives[0].id).toBe(first.passives[0].id)

    await saveCharacter(db, first)
    await saveCharacter(db, other)

    expect(await readCharacter(db, first.id)).toEqual(
      withoutDroppedDetails(first)
    )
    expect(await readCharacter(db, other.id)).toEqual(
      withoutDroppedDetails(other)
    )
  })

  test("deleting a character cascades to its child tables", async () => {
    const character = toCharacterDetail(rawCharacter)
    await saveCharacter(db, character)

    await db.delete(resonators).where(eq(resonators.id, character.id))

    expect(await readCharacter(db, character.id)).toBeNull()
    expect(await db.select().from(resonatorsMedia)).toEqual([])
  })

  test("expands the weapon passive into one effect per refinement rank", () => {
    const weapon = toWeaponDetail(rawWeapon)

    expect(weapon.refinements.map((refinement) => refinement.rank)).toEqual([
      1, 2, 3, 4, 5,
    ])
    expect(weapon.refinements.map((refinement) => refinement.effect)).toEqual(
      weaponRefinementEffects
    )
    expect(
      weapon.refinements.every((refinement) => refinement.stats.length === 0)
    ).toBe(true)
  })

  test("expands every highlighted span, not just the first", () => {
    const weapon = toWeaponDetail({
      ...rawWeapon,
      Desc: `Max HP is increased by <span ${highlighted}>12%/15%/18%/21%/24%</span>. After <span ${highlighted}>15/15/15/15/15</span>s.`,
    })

    expect(weapon.refinements[0].effect).toBe(
      `Max HP is increased by <span ${highlighted}>12%</span>. After <span ${highlighted}>15</span>s.`
    )
    expect(weapon.refinements[4].effect).toBe(
      `Max HP is increased by <span ${highlighted}>24%</span>. After <span ${highlighted}>15</span>s.`
    )
  })

  test("reuses the last value when a rank list is shorter than five", () => {
    const weapon = toWeaponDetail({
      ...rawWeapon,
      // Solar Flame ships a four-value list on a five-rank weapon.
      Desc: `Dura <span ${highlighted}>4/5/6/7</span> s.`,
    })

    expect(weapon.refinements.map((refinement) => refinement.effect)).toEqual([
      `Dura <span ${highlighted}>4</span> s.`,
      `Dura <span ${highlighted}>5</span> s.`,
      `Dura <span ${highlighted}>6</span> s.`,
      `Dura <span ${highlighted}>7</span> s.`,
      `Dura <span ${highlighted}>7</span> s.`,
    ])
  })

  test("keeps manually authored refinement stats across a re-save", async () => {
    const weapon = toWeaponDetail(rawWeapon)
    const withStats: EncoreWeaponDetail = {
      ...weapon,
      refinements: weapon.refinements.map((refinement) =>
        refinement.rank === 5
          ? { ...refinement, stats: [{ name: "HP%", value: 24 }] }
          : refinement
      ),
    }

    await saveWeapon(db, withStats)
    expect((await readWeapon(db, weapon.id))?.refinements[4].stats).toEqual([
      { name: "HP%", value: 24 },
    ])

    // The API mapper always sends empty stats; the sync must not drop them.
    await saveWeapon(db, weapon)
    const stored = await readWeapon(db, weapon.id)

    expect(stored?.refinements).toHaveLength(5)
    expect(stored?.refinements[4].stats).toEqual([{ name: "HP%", value: 24 }])
    expect(stored?.refinements[0].stats).toEqual([])
  })

  test("deleting a weapon cascades to its refinements and stats", async () => {
    const weapon = toWeaponDetail(rawWeapon)
    const withStats: EncoreWeaponDetail = {
      ...weapon,
      refinements: weapon.refinements.map((refinement) => ({
        ...refinement,
        stats: [{ name: "ATQ%", value: refinement.rank }],
      })),
    }

    await saveWeapon(db, withStats)
    await db.delete(weapons).where(eq(weapons.id, weapon.id))

    expect(await readWeapon(db, weapon.id)).toBeNull()
    expect(await db.select().from(weaponRefinementStats)).toEqual([])
  })
})
