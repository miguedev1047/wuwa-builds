/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  isComputedCondition,
  isEchoSkillCondition,
} from "@/modules/game-data/application/echoes/skills"
import {
  echoSkillBonusInput,
  echoSkillInput,
} from "@/modules/game-data/application/schemas"

const bonus = {
  echoId: 1,
  statId: "atk_percent",
  value: 10,
  requiresMainSlot: true,
  condition: "none" as const,
  conditionValue: null,
}

describe("echoSkillInput", () => {
  test("trims the descriptions and accepts a valid skill", () => {
    const parsed = echoSkillInput.parse({
      echoId: 1,
      description: "  Invoca  ",
      simpleDescription: "  Resumen  ",
      icon: "",
    })

    expect(parsed.description).toBe("Invoca")
    expect(parsed.simpleDescription).toBe("Resumen")
  })

  test("requires the echo and a description", () => {
    expect(
      echoSkillInput.safeParse({
        echoId: 0,
        description: "",
        simpleDescription: "",
        icon: "",
      }).success
    ).toBe(false)
  })
})

describe("echoSkillBonusInput", () => {
  test("accepts an unconditional bonus", () => {
    expect(echoSkillBonusInput.parse(bonus)).toEqual(bonus)
  })

  test("rejects a stat label instead of a canonical id", () => {
    expect(
      echoSkillBonusInput.safeParse({ ...bonus, statId: "Ataque %" }).success
    ).toBe(false)
  })

  test("requires a resonator id for the resonator condition", () => {
    expect(
      echoSkillBonusInput.safeParse({
        ...bonus,
        condition: "resonator",
        conditionValue: "1203",
      }).success
    ).toBe(true)
    expect(
      echoSkillBonusInput.safeParse({
        ...bonus,
        condition: "resonator",
        conditionValue: null,
      }).success
    ).toBe(false)
  })

  test("validates the element and weapon type ids", () => {
    expect(
      echoSkillBonusInput.safeParse({
        ...bonus,
        condition: "element",
        conditionValue: "aero",
      }).success
    ).toBe(true)
    expect(
      echoSkillBonusInput.safeParse({
        ...bonus,
        condition: "element",
        conditionValue: "Aero",
      }).success
    ).toBe(false)
    expect(
      echoSkillBonusInput.safeParse({
        ...bonus,
        condition: "weaponType",
        conditionValue: "sword",
      }).success
    ).toBe(true)
    expect(
      echoSkillBonusInput.safeParse({
        ...bonus,
        condition: "weaponType",
        conditionValue: "Espada",
      }).success
    ).toBe(false)
  })

  test("keeps none and combat without a value", () => {
    expect(
      echoSkillBonusInput.safeParse({
        ...bonus,
        condition: "combat",
        conditionValue: null,
      }).success
    ).toBe(true)
    expect(
      echoSkillBonusInput.safeParse({
        ...bonus,
        condition: "none",
        conditionValue: "aero",
      }).success
    ).toBe(false)
  })
})

describe("echo skill conditions", () => {
  test("only combat is not computable", () => {
    expect(isComputedCondition("combat")).toBe(false)
    expect(isComputedCondition("none")).toBe(true)
    expect(isComputedCondition("resonator")).toBe(true)
    expect(isComputedCondition("element")).toBe(true)
    expect(isComputedCondition("weaponType")).toBe(true)
  })

  test("narrows stored condition strings", () => {
    expect(isEchoSkillCondition("combat")).toBe(true)
    expect(isEchoSkillCondition("Combat")).toBe(false)
  })
})
