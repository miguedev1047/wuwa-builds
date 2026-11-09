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

describe("stats formatting", () => {
  test("rounds flat values at the display boundary", () => {
    expect(formatFlatStat(50732.4)).toBe("50732")
    expect(formatFlatStat(50732.6)).toBe("50733")
  })

  test("keeps one decimal and removes a trailing .0", () => {
    expect(formatPercentStat(118.4)).toBe("118.4%")
    expect(formatPercentStat(100)).toBe("100%")
    expect(
      formatStatValue({ key: "x", label: "X", value: 0, percent: true })
    ).toBe("0%")
  })
})

describe("statsRows", () => {
  test("includes the bonus of the resonator element", () => {
    const rows = statsRows(stats, "aero")

    expect(rows.find((row) => row.key === "element_aero")).toMatchObject({
      label: "Bono Aero",
      value: 12,
      percent: true,
    })
  })

  test("omits the element row when the element is unknown", () => {
    const rows = statsRows(stats, "")

    expect(rows.some((row) => row.key.startsWith("element_"))).toBe(false)
  })
})
