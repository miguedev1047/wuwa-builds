/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { EncoreSkill } from "@/modules/encore/domain/character"
import { createDefaultSkillLevels, getUpgradeableSkills } from "./skill-levels"

function skill(id: number, type: string, name = type): EncoreSkill {
  return {
    id,
    type,
    name,
    description: "",
    icon: "",
    media: "",
    attributes: [],
    consumes: [],
    damage: [],
  }
}

// Encore order for Aemeath: normal, resonance, liberation, inherent, inherent,
// intro, forte, inherent, outro, tune break.
const skills = [
  skill(1, "Ataque normal"),
  skill(2, "Habilidad de resonancia"),
  skill(3, "Liberación de resonancia"),
  skill(4, "Habilidad inherente"),
  skill(5, "Habilidad inherente"),
  skill(6, "Habilidad Intro"),
  skill(7, "Circuito del Forte"),
  skill(8, "Habilidad inherente"),
  skill(9, "Habilidad Outro"),
  skill(10, "Ruptura de Tonalidad"),
]

describe("getUpgradeableSkills", () => {
  test("returns the five upgradeable skills in game order", () => {
    const result = getUpgradeableSkills(skills)

    expect(result.map((item) => item.skillId)).toEqual([1, 2, 7, 3, 6])
    expect(result.map((item) => item.type)).toEqual([
      "Ataque normal",
      "Habilidad de resonancia",
      "Circuito del Forte",
      "Liberación de resonancia",
      "Habilidad Intro",
    ])
  })

  test("skips missing skill types", () => {
    const result = getUpgradeableSkills([
      skill(1, "Ataque normal"),
      skill(7, "Circuito del Forte"),
    ])

    expect(result.map((item) => item.skillId)).toEqual([1, 7])
  })
})

describe("createDefaultSkillLevels", () => {
  test("creates one entry per upgradeable skill, max level by default", () => {
    expect(createDefaultSkillLevels(skills)).toEqual([
      { skillId: 1, level: 10 },
      { skillId: 2, level: 10 },
      { skillId: 7, level: 10 },
      { skillId: 3, level: 10 },
      { skillId: 6, level: 10 },
    ])
  })

  test("accepts a custom initial level", () => {
    expect(createDefaultSkillLevels(skills, 1)).toEqual([
      { skillId: 1, level: 1 },
      { skillId: 2, level: 1 },
      { skillId: 7, level: 1 },
      { skillId: 3, level: 1 },
      { skillId: 6, level: 1 },
    ])
  })
})
