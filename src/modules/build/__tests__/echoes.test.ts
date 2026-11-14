/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { echoSlot } from "@build/__tests__/catalog-fixtures"
import { resolveEchoBonuses } from "@build/application/calculation/echoes"

describe("resolveEchoBonuses", () => {
  test("reads the selected main stats and substats of equipped echoes", () => {
    const bonuses = resolveEchoBonuses([
      echoSlot({
        index: 0,
        mainStatStat: "atk_percent",
        mainStatLabel: "Ataque %",
        mainStatValue: 33,
        substats: [
          {
            index: 0,
            valueStat: "crit_rate",
            valueLabel: "Prob. Crít.",
            valueNumber: 6.3,
          },
          {
            index: 1,
            valueStat: "crit_dmg",
            valueLabel: "Daño Crít.",
            valueNumber: 12.6,
          },
        ],
      }),
    ])

    expect(bonuses).toEqual([
      { statId: "atk", value: 150, source: "Eco 1 base" },
      { statId: "atk_percent", value: 33, source: "Eco 1 main" },
      { statId: "crit_rate", value: 6.3, source: "Eco 1 substat" },
      { statId: "crit_dmg", value: 12.6, source: "Eco 1 substat" },
    ])
  })

  test("skips empty slots and unselected stats", () => {
    const bonuses = resolveEchoBonuses([
      echoSlot({
        index: 0,
        data: null,
        mainStatStat: "atk_percent",
        mainStatValue: 33,
      }),
      echoSlot({
        index: 1,
        cost: 2,
        mainStatLabel: "Ataque %",
        substats: [
          {
            index: 0,
            valueLabel: "Prob. Crít.",
            valueStat: "",
            valueNumber: 6.3,
          },
        ],
      }),
    ])

    expect(bonuses).toEqual([])
  })

  test("skips selected stats with a zero value", () => {
    const bonuses = resolveEchoBonuses([
      echoSlot({
        cost: 2,
        mainStatStat: "atk_percent",
        mainStatValue: 0,
        substats: [
          {
            index: 0,
            valueStat: "crit_rate",
            valueLabel: "Prob. Crít.",
            valueNumber: 0,
          },
        ],
      }),
    ])

    expect(bonuses).toEqual([])
  })

  test("adds the flat primary stat of the echo cost at its level", () => {
    const bonuses = resolveEchoBonuses([
      echoSlot({
        index: 0,
        cost: 1,
        level: 0,
        mainStatStat: "",
        mainStatValue: 0,
        substats: [],
      }),
    ])

    expect(bonuses).toEqual([
      { statId: "hp", value: 456, source: "Eco 1 base" },
    ])
  })

  test("uses the canonical stat id, never the translated label", () => {
    const bonuses = resolveEchoBonuses([
      echoSlot({
        index: 2,
        mainStatStat: "hp_percent",
        mainStatLabel: "Ataque %",
        mainStatValue: 10,
        substats: [
          {
            index: 0,
            valueStat: "def_percent",
            valueLabel: "Vida %",
            valueNumber: 8.1,
          },
        ],
      }),
    ])

    expect(bonuses).toEqual([
      { statId: "atk", value: 150, source: "Eco 3 base" },
      { statId: "hp_percent", value: 10, source: "Eco 3 main" },
      { statId: "def_percent", value: 8.1, source: "Eco 3 substat" },
    ])
  })
})
