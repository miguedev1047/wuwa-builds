/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type {
  EncoreCharacterDetail,
  EncoreSkill,
} from "@/modules/encore/domain/character"
import { SKILL_LEVEL_MAX } from "../../domain/build"
import { createBuildDraftFromEncoreCharacter } from "./build-draft"

function skill(id: number, type: string): EncoreSkill {
  return {
    id,
    type,
    name: type,
    description: "",
    icon: "",
    media: "",
    attributes: [],
    consumes: [],
    damage: [],
  }
}

function character(skills: EncoreSkill[]): EncoreCharacterDetail {
  return {
    id: 42,
    name: "Aemeath",
    rarity: 5,
    element: "Fusion",
    weaponType: "Sword",
    icon: "character-icon",
    nickname: "",
    introduction: "",
    images: {
      card: "",
      icon: "",
      iconLarge: "",
      circle: "",
      portrait: "",
    },
    tags: [],
    properties: [],
    skills,
    sequences: [],
    passives: [],
    breaches: [],
  }
}

describe("createBuildDraftFromEncoreCharacter", () => {
  test("seeds upgradeable skill defaults without copying the character", () => {
    const draft = createBuildDraftFromEncoreCharacter({
      id: "draft-1",
      character: character([
        skill(1, "Ataque normal"),
        skill(2, "Habilidad de resonancia"),
        skill(3, "Circuito del Forte"),
      ]),
      createdAt: "2026-10-28T12:00:00.000Z",
    })

    expect(draft.characterId).toBe(42)
    expect(draft.payload.resonator.skillLevels).toEqual([
      { skillId: 1, level: SKILL_LEVEL_MAX },
      { skillId: 2, level: SKILL_LEVEL_MAX },
      { skillId: 3, level: SKILL_LEVEL_MAX },
    ])
    expect(draft).not.toHaveProperty("character")
  })
})
