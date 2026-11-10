/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { STAT_KINDS } from "@builds/domain/stats"
import {
  WEAPON_REFINEMENT_STATS,
  WEAPON_REFINEMENT_STAT_OPTIONS,
} from "@game-data/application/weapons/refinement-stats"

describe("WEAPON_REFINEMENT_STATS", () => {
  test("offers a single option per label", () => {
    const labels = WEAPON_REFINEMENT_STAT_OPTIONS.map((option) => option.label)

    expect(new Set(labels).size).toBe(labels.length)
  })

  test("includes the six element bonuses and the echo bonus", () => {
    const labels = WEAPON_REFINEMENT_STATS.map((stat) => stat.label)

    expect(labels).toEqual(
      expect.arrayContaining([
        "Bono de Daño Aero",
        "Bono de Daño Glacio",
        "Bono de Daño Electro",
        "Bono de Daño Fusión",
        "Bono de Daño Destrucción",
        "Bono de Daño Espectro",
        "Bono de Eco",
      ])
    )
  })

  test("maps the main stats to canonical builder keys", () => {
    for (const stat of WEAPON_REFINEMENT_STATS) {
      if (!("statId" in stat)) continue

      expect(STAT_KINDS[stat.statId as keyof typeof STAT_KINDS]).toBeDefined()
    }
  })
})
