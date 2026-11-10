/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  weaponDetail,
  weaponProperty,
  weaponRefinement,
} from "@builds/application/calculation/catalog-fixtures"
import { resolveWeaponStats } from "@builds/application/calculation/weapon"

const properties = [
  weaponProperty({
    name: "atk",
    baseValue: 100,
    values: [
      { level: 1, value: "100" },
      { level: 90, value: "500" },
    ],
  }),
  weaponProperty({
    name: "crit_rate",
    baseValue: 5,
    values: [
      { level: 1, value: "5%" },
      { level: 90, value: "24.3%" },
    ],
  }),
]

describe("resolveWeaponStats", () => {
  test("resolves base attack and the secondary stat at the weapon level", () => {
    const result = resolveWeaponStats({
      detail: weaponDetail({ properties }),
      level: 90,
      refinementRank: 1,
    })

    expect(result.baseAtk).toBe(500)
    expect(result.bonuses).toEqual([
      { statId: "crit_rate", value: 24.3, source: "Arma" },
    ])
    expect(result.diagnostics).toEqual([])
  })

  test("rounds the secondary stat to the game's one-decimal display", () => {
    const result = resolveWeaponStats({
      detail: weaponDetail({
        properties: [
          weaponProperty({
            name: "atk",
            baseValue: 100,
            values: [{ level: 90, value: "412.5" }],
          }),
          weaponProperty({
            name: "hp_percent",
            baseValue: 16.05,
            values: [{ level: 90, value: "72.23%" }],
          }),
        ],
      }),
      level: 90,
      refinementRank: 1,
    })

    expect(result.baseAtk).toBe(412.5)
    expect(result.bonuses).toEqual([
      { statId: "hp_percent", value: 72.2, source: "Arma" },
    ])
  })

  test("adds the structured stats of the selected refinement", () => {
    const result = resolveWeaponStats({
      detail: weaponDetail({
        properties,
        refinements: [
          weaponRefinement({
            rank: 1,
            stats: [{ statName: "atk_percent", statNumber: 12 }],
            effect: "Efecto rango 1",
          }),
          weaponRefinement({
            rank: 2,
            stats: [
              { statName: "atk_percent", statNumber: 15 },
              { statName: "crit_dmg", statNumber: 20 },
            ],
            effect: "Efecto rango 2",
          }),
        ],
      }),
      level: 90,
      refinementRank: 2,
    })

    expect(result.bonuses).toEqual([
      { statId: "crit_rate", value: 24.3, source: "Arma" },
      { statId: "atk_percent", value: 15, source: "Refinamiento 2" },
      { statId: "crit_dmg", value: 20, source: "Refinamiento 2" },
    ])
    expect(result.conditionalEffects).toEqual([
      { source: "Refinamiento 2", description: "Efecto rango 2" },
    ])
  })

  test("skips zero refinement stats and reports unknown stat ids", () => {
    const result = resolveWeaponStats({
      detail: weaponDetail({
        properties,
        refinements: [
          weaponRefinement({
            rank: 1,
            stats: [
              { statName: "atk_percent", statNumber: 0 },
              { statName: "not_a_stat", statNumber: 10 },
            ],
          }),
        ],
      }),
      level: 90,
      refinementRank: 1,
    })

    expect(result.bonuses).toEqual([
      { statId: "crit_rate", value: 24.3, source: "Arma" },
    ])
    expect(result.diagnostics).toEqual(["Unknown refinement stat: not_a_stat"])
  })

  test("reports a missing refinement rank", () => {
    const result = resolveWeaponStats({
      detail: weaponDetail({
        properties,
        refinements: [weaponRefinement({ rank: 1, stats: [] })],
      }),
      level: 90,
      refinementRank: 3,
    })

    expect(result.diagnostics).toEqual(["Refinement rank 3 not found"])
  })

  test("normalizes legacy Encore ATQ labels with the value unit", () => {
    const result = resolveWeaponStats({
      detail: weaponDetail({
        properties: [
          weaponProperty({
            name: "ATQ",
            baseValue: 100,
            values: [
              { level: 1, value: "100" },
              { level: 90, value: "500" },
            ],
          }),
          weaponProperty({
            name: "ATQ",
            baseValue: 5,
            values: [
              { level: 1, value: "8.10%" },
              { level: 90, value: "33.00%" },
            ],
          }),
        ],
      }),
      level: 90,
      refinementRank: 1,
    })

    expect(result.baseAtk).toBe(500)
    expect(result.bonuses).toEqual([
      { statId: "atk_percent", value: 33, source: "Arma" },
    ])
  })

  test("reports an unknown secondary property", () => {
    const result = resolveWeaponStats({
      detail: weaponDetail({
        properties: [
          weaponProperty({
            name: "atk",
            baseValue: 100,
            values: [{ level: 1, value: "100" }],
          }),
          weaponProperty({
            name: "Mystery",
            baseValue: 1,
            values: [{ level: 1, value: "1" }],
          }),
        ],
      }),
      level: 1,
      refinementRank: 1,
    })

    expect(result.bonuses).toEqual([])
    expect(result.diagnostics).toEqual(["Unknown weapon property: Mystery"])
  })

  test("uses baseValue when a property has no growth rows", () => {
    const result = resolveWeaponStats({
      detail: weaponDetail({
        properties: [
          weaponProperty({
            name: "atk",
            baseValue: 100,
            values: [],
          }),
        ],
      }),
      level: 90,
      refinementRank: 1,
    })

    expect(result.baseAtk).toBe(100)
  })
})
