/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { CharacterStats } from "@/modules/builds/domain/character-stats"
import {
  formatCharacterStats,
  formatFlatStat,
  formatPercentStat,
} from "./format-character-stats"

describe("formatFlatStat", () => {
  test("rounds only at the display boundary", () => {
    expect(formatFlatStat(50732.4)).toBe("50732")
    expect(formatFlatStat(50732.6)).toBe("50733")
  })
})

describe("formatPercentStat", () => {
  test("keeps one decimal and removes a trailing .0", () => {
    expect(formatPercentStat(118.4)).toBe("118.4%")
    expect(formatPercentStat(100)).toBe("100%")
    expect(formatPercentStat(65.64)).toBe("65.6%")
  })
})

describe("formatCharacterStats", () => {
  test("keeps raw values separate from the display object", () => {
    const stats: CharacterStats = {
      hp: 50732.4,
      atk: 1145.2,
      def: 671.4,
      energyRegen: 118.4,
      critRate: 65.64,
      critDmg: 270.2,
      skillDmg: 24,
      basicDmg: 0,
      heavyDmg: 0,
      liberationDmg: 0,
      healingBonus: 0,
      elementDmgBonus: {
        glacio: 0,
        fusion: 0,
        electro: 0,
        aero: 12,
        spectro: 0,
        havoc: 0,
      },
    }

    expect(formatCharacterStats(stats)).toEqual({
      hp: "50732",
      atk: "1145",
      def: "671",
      energyRegen: "118.4%",
      critRate: "65.6%",
      critDmg: "270.2%",
      skillDmg: "24%",
      basicDmg: "0%",
      heavyDmg: "0%",
      liberationDmg: "0%",
      healingBonus: "0%",
      elementDmgBonus: {
        glacio: "0%",
        fusion: "0%",
        electro: "0%",
        aero: "12%",
        spectro: "0%",
        havoc: "0%",
      },
    })
  })
})
