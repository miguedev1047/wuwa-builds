/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { CharacterStats } from "@/modules/builds/domain/character-stats"
import {
  formatFlatStat,
  formatPercentStat,
  formatStatValue,
  statsRows,
} from "./stats-view-model"

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

describe("stats formatting", () => {
  test("rounds flat values at the display boundary", () => {
    expect(formatFlatStat(50732.4)).toBe("50732")
    expect(formatFlatStat(50732.6)).toBe("50733")
  })

  test("keeps one decimal and removes a trailing .0", () => {
    expect(formatPercentStat(118.4)).toBe("118.4%")
    expect(formatPercentStat(100)).toBe("100%")
    expect(
      formatStatValue({ key: "crit_rate", label: "X", value: 0, percent: true })
    ).toBe("0%")
  })
})

describe("statsRows", () => {
  test("includes the bonus of the resonator element", () => {
    const rows = statsRows(stats, "aero")

    expect(rows.find((row) => row.key === "aero_dmg")).toMatchObject({
      label: "Bono Aero",
      value: 12,
      percent: true,
    })
  })

  test("omits the element row when the element is unknown", () => {
    const rows = statsRows(stats, "")

    expect(rows.some((row) => row.key === "aero_dmg")).toBe(false)
  })
})
