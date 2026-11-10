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
      energy_regen: 118.4,
      crit_rate: 65.64,
      crit_dmg: 270.2,
      skill_bonus: 24,
      basic_atk_bonus: 0,
      heavy_atk_bonus: 0,
      liberation_bonus: 0,
      healing_bonus: 0,
      aero_dmg: 12,
      glacio_dmg: 0,
      electro_dmg: 0,
      fusion_dmg: 0,
      havoc_dmg: 0,
      spectro_dmg: 0,
    }

    expect(formatCharacterStats(stats)).toEqual({
      hp: "50732",
      atk: "1145",
      def: "671",
      energy_regen: "118.4%",
      crit_rate: "65.6%",
      crit_dmg: "270.2%",
      skill_bonus: "24%",
      basic_atk_bonus: "0%",
      heavy_atk_bonus: "0%",
      liberation_bonus: "0%",
      healing_bonus: "0%",
      aero_dmg: "12%",
      glacio_dmg: "0%",
      electro_dmg: "0%",
      fusion_dmg: "0%",
      havoc_dmg: "0%",
      spectro_dmg: "0%",
    })
  })
})
