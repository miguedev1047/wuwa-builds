/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  buildPassive,
  characterDetail,
  resonatorProperty,
  resonatorSequence,
} from "@builds/__tests__/catalog-fixtures"
import { resolveResonatorStats } from "@builds/application/calculation/resonator"

const baseProperties = [
  resonatorProperty({
    name: "hp",
    baseValue: 816,
    values: [
      { level: 1, value: 816 },
      { level: 20, value: 884.7072 },
      { level: 90, value: 1000 },
    ],
  }),
  resonatorProperty({
    name: "atk",
    baseValue: 32,
    values: [
      { level: 1, value: 32 },
      { level: 90, value: 100 },
    ],
  }),
  resonatorProperty({
    name: "def",
    baseValue: 40,
    values: [
      { level: 1, value: 40 },
      { level: 90, value: 50 },
    ],
  }),
  resonatorProperty({
    name: "crit_rate",
    baseValue: 5,
    values: [
      { level: 1, value: "5%" },
      { level: 90, value: "8%" },
    ],
  }),
  resonatorProperty({
    name: "crit_dmg",
    baseValue: 150,
    values: [
      { level: 1, value: "150%" },
      { level: 90, value: "160%" },
    ],
  }),
]

describe("resolveResonatorStats", () => {
  test("uses the growth value at the real level without adding baseValue", () => {
    const result = resolveResonatorStats({
      detail: characterDetail({ properties: baseProperties }),
      level: 1,
      passives: [],
      sequence: 0,
    })

    expect(result.base.hp).toBe(816)
    expect(result.base.atk).toBe(32)
  })

  test("falls back to the latest lower level and parses percentage strings", () => {
    const result = resolveResonatorStats({
      detail: characterDetail({ properties: baseProperties }),
      level: 50,
      passives: [],
      sequence: 0,
    })

    expect(result.base.hp).toBe(884.7072)
    expect(result.base.crit_rate).toBe(5)
    expect(result.base.crit_dmg).toBe(150)
  })

  test("keeps the default crit and energy bases when the catalog omits them", () => {
    const result = resolveResonatorStats({
      detail: characterDetail({
        properties: [
          resonatorProperty({
            name: "hp",
            baseValue: 1000,
            values: [{ level: 1, value: 1000 }],
          }),
        ],
      }),
      level: 1,
      passives: [],
      sequence: 0,
    })

    expect(result.base.crit_rate).toBe(5)
    expect(result.base.crit_dmg).toBe(150)
    expect(result.base.energy_regen).toBe(100)
  })

  test("resolves Encore labels through the alias map", () => {
    const result = resolveResonatorStats({
      detail: characterDetail({
        properties: [
          resonatorProperty({
            name: "PS",
            baseValue: 1000,
            values: [{ level: 1, value: 1000 }],
          }),
          resonatorProperty({
            name: "Prob. CRIT",
            baseValue: 5,
            values: [{ level: 1, value: "5%" }],
          }),
        ],
      }),
      level: 1,
      passives: [],
      sequence: 0,
    })

    expect(result.base.hp).toBe(1000)
    expect(result.base.crit_rate).toBe(5)
    expect(result.diagnostics).toEqual([])
  })

  test("uses baseValue when the property has no growth rows", () => {
    const result = resolveResonatorStats({
      detail: characterDetail({
        properties: [
          resonatorProperty({
            name: "hp",
            baseValue: 1000,
            values: [],
          }),
        ],
      }),
      level: 90,
      passives: [],
      sequence: 0,
    })

    expect(result.base.hp).toBe(1000)
  })

  test("reports unknown properties and keeps them out of the base stats", () => {
    const result = resolveResonatorStats({
      detail: characterDetail({
        properties: [
          resonatorProperty({
            name: "unknown_stat",
            baseValue: 1,
            values: [{ level: 1, value: 1 }],
          }),
        ],
      }),
      level: 1,
      passives: [],
      sequence: 0,
    })

    expect(result.diagnostics).toEqual([
      "Unknown resonator property: unknown_stat",
    ])
    expect(result.base.hp).toBe(0)
  })

  test("reports recognized properties that are not part of the base contract", () => {
    const result = resolveResonatorStats({
      detail: characterDetail({
        properties: [
          resonatorProperty({
            name: "break_impulse",
            baseValue: 10,
            values: [{ level: 1, value: 10 }],
          }),
        ],
      }),
      level: 1,
      passives: [],
      sequence: 0,
    })

    expect(result.diagnostics).toEqual([
      "break_impulse is not part of the resonator base stats",
    ])
  })

  test("sums the stat passives mapped by title", () => {
    const result = resolveResonatorStats({
      detail: characterDetail({ properties: baseProperties }),
      level: 1,
      passives: [
        buildPassive({ name: "PS+", value: 1.8 }),
        buildPassive({ name: "PS+", value: 4.2 }),
        buildPassive({ name: "Prob. CRIT+", value: 1.2 }),
        buildPassive({ name: "PS+", value: 9, enabled: false }),
        buildPassive({ name: "Corazón que teje anhelos", value: 0 }),
      ],
      sequence: 0,
    })

    expect(result.bonuses).toEqual([
      { statId: "hp_percent", value: 1.8, source: "Pasiva PS+" },
      { statId: "hp_percent", value: 4.2, source: "Pasiva PS+" },
      { statId: "crit_rate", value: 1.2, source: "Pasiva Prob. CRIT+" },
    ])
    expect(result.conditionalEffects).toEqual([
      { source: "Pasiva", description: "Corazón que teje anhelos: 0" },
    ])
  })

  test("exposes enabled passives as conditional effects, never as stats", () => {
    const result = resolveResonatorStats({
      detail: characterDetail({ properties: baseProperties }),
      level: 1,
      passives: [
        buildPassive({ name: "Pasiva A", value: 12, enabled: true }),
        buildPassive({ name: "Pasiva B", value: 20, enabled: false }),
      ],
      sequence: 0,
    })

    expect(result.bonuses).toEqual([])
    expect(result.conditionalEffects).toEqual([
      { source: "Pasiva", description: "Pasiva A: 12" },
    ])
  })

  test("includes only the reached sequence nodes", () => {
    const result = resolveResonatorStats({
      detail: characterDetail({
        properties: baseProperties,
        sequences: [
          resonatorSequence({ index: 1, description: "Nodo 1" }),
          resonatorSequence({ index: 2, description: "Nodo 2" }),
        ],
      }),
      level: 1,
      passives: [],
      sequence: 1,
    })

    expect(result.conditionalEffects).toEqual([
      { source: "Secuencia", description: "Nodo 1" },
    ])
  })
})
