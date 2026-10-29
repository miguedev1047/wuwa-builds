/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { createEmptyBuildPayload } from "./build"
import {
  calculateBuildStats,
  type BuildReferenceData,
} from "./calculate-build-stats"

const reference: BuildReferenceData = {
  character: {
    baseHp: 1000,
    baseAtk: 100,
    baseDef: 50,
    critRate: 5,
    critDmg: 150,
    energyRegen: 100,
  },
  weapon: { baseAtk: 50 },
}

describe("calculateBuildStats", () => {
  test("returns base stats for an empty payload", () => {
    const stats = calculateBuildStats(createEmptyBuildPayload(), reference)

    expect(stats.hp).toBe(1000)
    expect(stats.atk).toBe(150)
    expect(stats.def).toBe(50)
    expect(stats.critRate).toBe(5)
    expect(stats.critDmg).toBe(150)
    expect(stats.energyRegen).toBe(100)
    expect(stats.unknownStats).toEqual([])
  })

  test("applies flat and percent bonuses to the correct base", () => {
    const stats = calculateBuildStats(createEmptyBuildPayload(), {
      ...reference,
      extraBonuses: [
        { statId: "atk_percent", value: 20 },
        { statId: "atk", value: 30 },
        { statId: "hp_percent", value: 10 },
      ],
    })

    expect(stats.atk).toBe(210)
    expect(stats.hp).toBe(1100)
  })

  test("reads echo substats and main stats from the payload/reference", () => {
    const payload = createEmptyBuildPayload()
    payload.echoLoadout[0].substats = [{ statId: "crit_rate", value: 6.3 }]
    payload.echoLoadout[1].substats = [{ statId: "crit_dmg", value: 12.6 }]

    const stats = calculateBuildStats(payload, {
      ...reference,
      echoMainStats: [
        { statId: "atk_percent", value: 33 },
        null,
        null,
        null,
        null,
      ],
    })

    expect(stats.atk).toBeCloseTo(150 * 1.33, 5)
    expect(stats.critRate).toBeCloseTo(11.3, 5)
    expect(stats.critDmg).toBeCloseTo(162.6, 5)
  })

  test("reports unknown stat ids instead of silently dropping them", () => {
    const stats = calculateBuildStats(createEmptyBuildPayload(), {
      ...reference,
      extraBonuses: [{ statId: "not_a_stat", value: 10 }],
    })

    expect(stats.unknownStats).toEqual(["not_a_stat"])
  })
})
