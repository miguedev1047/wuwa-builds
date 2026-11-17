/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type {
  ResonatorPassivesDataProps,
  ResonatorSkillsDataProps,
} from "@build/domain/build-record"
import {
  withPassiveEnabled,
  withSkillLevel,
  withSkillStep,
} from "@build/application/resonator-config"

const skills: ResonatorSkillsDataProps[] = [
  { id: 1, skillId: 101, level: 5 },
  { id: 2, skillId: 102, level: 5 },
]

const passives: ResonatorPassivesDataProps[] = [
  {
    id: 1,
    passiveId: 201,
    name: "ATQ",
    value: 10,
    icon: "",
    type: "passive",
    enabled: true,
  },
]

describe("withSkillLevel", () => {
  test("replaces the target skill without mutating the input", () => {
    const next = withSkillLevel(skills, 101, 8)

    expect(next[0].level).toBe(8)
    expect(next[1].level).toBe(5)
    expect(skills[0].level).toBe(5)
  })

  test("clamps levels to the allowed range", () => {
    expect(withSkillLevel(skills, 101, 0)[0].level).toBe(1)
    expect(withSkillLevel(skills, 101, 99)[0].level).toBe(10)
  })
})

describe("withSkillStep", () => {
  test("moves the target skill by one step", () => {
    const next = withSkillStep(skills, 101, 1)

    expect(next[0].level).toBe(6)
    expect(next[1].level).toBe(5)
    expect(skills[0].level).toBe(5)
  })

  test("keeps the level inside the allowed range", () => {
    const atMax = [{ ...skills[0], level: 10 }]

    expect(withSkillStep(atMax, 101, 1)[0].level).toBe(10)
    expect(withSkillStep(skills, 101, -9)[0].level).toBe(1)
  })

  test("returns the same list for an unknown skill", () => {
    expect(withSkillStep(skills, 999, 1)).toBe(skills)
  })
})

describe("withPassiveEnabled", () => {
  test("toggles only the requested passive", () => {
    const next = withPassiveEnabled(passives, 1, false)

    expect(next[0].enabled).toBe(false)
    expect(passives[0].enabled).toBe(true)
  })
})
