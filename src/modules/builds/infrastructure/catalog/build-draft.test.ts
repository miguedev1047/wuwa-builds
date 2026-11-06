/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { CharacterSkill } from "@/modules/game-data/domain/character"
import { SKILL_LEVEL_MAX } from "../../domain/build"
import {
  createBuildDraftFromCharacter,
  type BuildDraftCharacter,
} from "./build-draft"

function skill(skillId: number, type: string): CharacterSkill {
  return { skillId, type, name: type }
}

function character(skills: CharacterSkill[]): BuildDraftCharacter {
  return {
    id: 42,
    name: "Aemeath",
    icon: "character-icon",
    iconLarge: "character-icon-large",
    rarity: 5,
    element: "fusion",
    weaponType: "sword",
    skills,
  }
}

describe("createBuildDraftFromCharacter", () => {
  test("seeds upgradeable skill defaults without copying the character", () => {
    const draft = createBuildDraftFromCharacter({
      id: "draft-1",
      character: character([
        skill(1, "Ataque normal"),
        skill(2, "Habilidad de resonancia"),
        skill(3, "Circuito del Forte"),
      ]),
      createdAt: "2026-10-28T12:00:00.000Z",
    })

    expect(draft.characterId).toBe(42)
    expect(draft.characterSnapshot).toMatchObject({
      id: 42,
      name: "Aemeath",
      iconLarge: "character-icon-large",
      weaponType: "sword",
    })
    expect(draft.payload.resonator.skillLevels).toEqual([
      { skillId: 1, level: SKILL_LEVEL_MAX },
      { skillId: 2, level: SKILL_LEVEL_MAX },
      { skillId: 3, level: SKILL_LEVEL_MAX },
    ])
    expect(draft).not.toHaveProperty("character")
  })
})
