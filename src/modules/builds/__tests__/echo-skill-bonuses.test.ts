/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  echoDetail,
  echoSkillBonus,
  echoSlot,
} from "@builds/__tests__/catalog-fixtures"
import { resolveEchoSkillBonuses } from "@builds/application/calculation/echo-skill-bonuses"

const echoes = [
  echoSlot({ index: 0, data: { ...echoSlot().data!, id: 1 } }),
  echoSlot({ index: 1, data: { ...echoSlot().data!, id: 2 } }),
]

const context = {
  resonatorId: 123,
  element: "aero",
  weaponType: "sword",
  mainEchoSlot: 0,
}

describe("resolveEchoSkillBonuses", () => {
  test("applies unconditional bonuses of equipped echoes", () => {
    const result = resolveEchoSkillBonuses({
      echoes,
      details: [
        echoDetail({
          id: 1,
          name: "Eco Uno",
          skillBonuses: [echoSkillBonus({ statId: "atk_percent", value: 10 })],
        }),
      ],
      context,
    })

    expect(result.bonuses).toEqual([
      { statId: "atk_percent", value: 10, source: "Eco Uno" },
    ])
    expect(result.diagnostics).toEqual([])
  })

  test("applies a main-slot bonus only when the slot is marked as main", () => {
    const bonus = echoSkillBonus({
      statId: "crit_dmg",
      value: 20,
      requiresMainSlot: true,
    })

    const main = resolveEchoSkillBonuses({
      echoes,
      details: [echoDetail({ id: 1, name: "Eco Uno", skillBonuses: [bonus] })],
      context,
    })
    const notMain = resolveEchoSkillBonuses({
      echoes,
      details: [echoDetail({ id: 1, name: "Eco Uno", skillBonuses: [bonus] })],
      context: { ...context, mainEchoSlot: 1 },
    })

    expect(main.bonuses).toEqual([
      { statId: "crit_dmg", value: 20, source: "Eco Uno" },
    ])
    expect(notMain.bonuses).toEqual([])
    expect(notMain.conditionalEffects).toEqual([
      {
        source: "Eco Uno",
        description: "Requiere eco principal: Daño Crit. +20%",
      },
    ])
  })

  test("keeps combat triggers as conditional effects", () => {
    const result = resolveEchoSkillBonuses({
      echoes,
      details: [
        echoDetail({
          id: 1,
          name: "Eco Uno",
          skillBonuses: [
            echoSkillBonus({
              statId: "skill_bonus",
              value: 30,
              condition: "combat",
            }),
          ],
        }),
      ],
      context,
    })

    expect(result.bonuses).toEqual([])
    expect(result.conditionalEffects).toEqual([
      { source: "Eco Uno", description: "Bono de Daño de Habilidad +30%" },
    ])
  })

  test("filters resonator, element and weapon type conditions", () => {
    const result = resolveEchoSkillBonuses({
      echoes,
      details: [
        echoDetail({
          id: 1,
          name: "Eco Uno",
          skillBonuses: [
            echoSkillBonus({
              statId: "atk",
              value: 40,
              condition: "resonator",
              conditionValue: "123",
            }),
            echoSkillBonus({
              statId: "atk",
              value: 99,
              condition: "resonator",
              conditionValue: "999",
            }),
            echoSkillBonus({
              statId: "aero_dmg",
              value: 12,
              condition: "element",
              conditionValue: "Aero",
            }),
            echoSkillBonus({
              statId: "glacio_dmg",
              value: 99,
              condition: "element",
              conditionValue: "Gelio",
            }),
            echoSkillBonus({
              statId: "crit_rate",
              value: 8,
              condition: "weaponType",
              conditionValue: "Espada",
            }),
            echoSkillBonus({
              statId: "crit_rate",
              value: 99,
              condition: "weaponType",
              conditionValue: "Mandoble",
            }),
          ],
        }),
      ],
      context,
    })

    expect(result.bonuses).toEqual([
      { statId: "atk", value: 40, source: "Eco Uno" },
      { statId: "aero_dmg", value: 12, source: "Eco Uno" },
      { statId: "crit_rate", value: 8, source: "Eco Uno" },
    ])
    expect(result.diagnostics).toEqual([])
  })

  test("reports unknown stats and conditions", () => {
    const result = resolveEchoSkillBonuses({
      echoes,
      details: [
        echoDetail({
          id: 1,
          name: "Eco Uno",
          skillBonuses: [
            echoSkillBonus({ statId: "not_a_stat", value: 10 }),
            echoSkillBonus({ statId: "atk", value: 10, condition: "mystery" }),
          ],
        }),
      ],
      context,
    })

    expect(result.bonuses).toEqual([])
    expect(result.diagnostics).toEqual([
      "Unknown echo bonus stat: not_a_stat",
      "Unknown echo bonus condition: mystery",
    ])
  })

  test("ignores bonuses of echoes that are not equipped", () => {
    const result = resolveEchoSkillBonuses({
      echoes,
      details: [
        echoDetail({
          id: 99,
          name: "Eco Ajeno",
          skillBonuses: [echoSkillBonus({ statId: "atk", value: 10 })],
        }),
      ],
      context,
    })

    expect(result.bonuses).toEqual([])
  })
})
