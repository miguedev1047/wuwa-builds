/// <reference types="bun" />

import { Database } from "bun:sqlite"
import { beforeEach, describe, expect, test } from "bun:test"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/bun-sqlite"
import type { AppDb } from "@/db/create"
import { relations } from "@/db/relations"
import { resonators } from "@/db/schema"
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
  NickName: { Title: "Brisa", Content: "Brisa" },
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

/** Trimmed but structurally faithful `weapon/{id}` response. */
const rawWeapon: RawWeaponDetail = {
  ItemId: 21010074,
  WeaponName: "Rastro de otoño",
  QualityId: 4,
  WeaponType: 1,
  WeaponTypeName: "Mandoble",
  // Weapon detail endpoints send Unreal asset paths (`Package.Object`).
  Icon: "/Game/Aki/UI/Image/IconWeapon/weapon.weapon",
  Desc: "Efecto pasivo",
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
  Breaches: [
    { Id: 1, Level: 0, LevelLimit: 20, Items: [{ Key: 2, Value: 3 }] },
  ],
}

/** Trimmed but structurally faithful `echo/{id}` response. */
const rawEcho: RawEchoDetail = {
  MonsterId: 6000038,
  ItemId: 6000039,
  MonsterName: "Campemico",
  Rarity: 5,
  Icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/Image/echo.webp",
  Element: { Name: "Aero" },
  AttributesDescription: "Descripción del eco",
  Skill: {
    DescriptionEx: "Habilidad del eco",
    SkillCD: 12,
    DamageList: [{ EntryNumber: 1, Id: 1, DmgType: "Aero" }],
  },
  FetterGroupDetails: [
    { Group: { Id: 9, FetterGroupName: "Melodías perdurables" } },
  ],
  FetterDetails: {
    "Melodías perdurables": { EffectDescriptions: ["2 piezas", "5 piezas"] },
  },
}

describe("encore catalog schema", () => {
  let db: AppDb

  beforeEach(() => {
    db = createTestDb()
  })

  test("round-trips a character + weapon + echo without losing fields", async () => {
    const character = toCharacterDetail(rawCharacter)
    const weapon = toWeaponDetail(rawWeapon)
    const echo = toEchoDetail(rawEcho)

    await saveCharacter(db, character)
    await saveWeapon(db, weapon)
    await saveEcho(db, echo)

    expect(await readCharacter(db, character.id)).toEqual(character)
    expect(await readWeapon(db, weapon.id)).toEqual(weapon)
    expect(await readEcho(db, echo.id)).toEqual(echo)
  })

  test("rebuilds the list endpoints from the detail rows", async () => {
    await saveCharacter(db, toCharacterDetail(rawCharacter))
    await saveWeapon(db, toWeaponDetail(rawWeapon))
    await saveEcho(db, toEchoDetail(rawEcho))

    expect(await readCharacters(db)).toEqual([
      {
        id: 1402,
        name: "Yangyang",
        rarity: 4,
        element: "Aero",
        weaponType: "Espada",
        icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/Image/icon.webp",
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
        rarity: 5,
        element: "Aero",
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

  test("re-saving replaces child rows instead of duplicating them", async () => {
    const character = toCharacterDetail(rawCharacter)
    await saveCharacter(db, character)
    await saveCharacter(db, character)

    const stored = await readCharacter(db, character.id)
    expect(stored?.skills).toHaveLength(1)
    expect(stored?.skills[0].attributes).toHaveLength(2)
    expect(stored?.properties[0].growth).toHaveLength(3)
    expect(stored?.passives[0].consume).toHaveLength(1)
    expect(stored?.breaches).toHaveLength(2)
    expect(stored?.tags).toHaveLength(1)
    expect(stored?.sequences).toHaveLength(1)
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

    expect(await readCharacter(db, first.id)).toEqual(first)
    expect(await readCharacter(db, other.id)).toEqual(other)
  })

  test("deleting a character cascades to its child tables", async () => {
    const character = toCharacterDetail(rawCharacter)
    await saveCharacter(db, character)

    await db.delete(resonators).where(eq(resonators.id, character.id))

    expect(await readCharacter(db, character.id)).toBeNull()
  })
})
