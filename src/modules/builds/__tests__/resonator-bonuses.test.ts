/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { resolveResonatorBonuses } from "@builds/application/calculation/resonator-bonuses"
import type { ResonatorPassivesDataProps } from "@builds/domain/build-record"

function passive(
  overrides: Partial<ResonatorPassivesDataProps> = {}
): ResonatorPassivesDataProps {
  return {
    id: 1,
    passiveId: 100,
    name: "ATQ+",
    value: 5,
    icon: "atk.png",
    type: "passive",
    enabled: true,
    ...overrides,
  }
}

describe("resolveResonatorBonuses", () => {
  test("sums the enabled passives that share a stat", () => {
    const bonuses = resolveResonatorBonuses([
      passive(),
      passive({ id: 2, value: 3.5, icon: "atk-2.png" }),
    ])

    expect(bonuses).toEqual([
      { statId: "atk_percent", name: "ATQ+", icon: "atk.png", value: 8.5 },
    ])
  })

  test("collapses aliases of the same canonical stat", () => {
    const bonuses = resolveResonatorBonuses([
      passive({ name: "Bono de Daño de Habilidad+", value: 6 }),
      passive({ id: 2, name: "Bono Habilidad+", value: 4 }),
    ])

    expect(bonuses).toHaveLength(1)
    expect(bonuses[0].statId).toBe("skill_bonus")
    expect(bonuses[0].value).toBe(10)
  })

  test("leaves disabled passives out of the totals", () => {
    const bonuses = resolveResonatorBonuses([
      passive({ value: 5 }),
      passive({ id: 2, value: 5, enabled: false }),
    ])

    expect(bonuses[0].value).toBe(5)
  })

  test("keeps named passives apart by their own title", () => {
    const bonuses = resolveResonatorBonuses([
      passive({ name: "Corazón que teje anhelos", value: 2 }),
      passive({ id: 2, name: "Viento que graba marcas", value: 3 }),
    ])

    expect(bonuses).toHaveLength(2)
    expect(bonuses.every((bonus) => bonus.statId === null)).toBe(true)
  })

  test("ignores spaces and casing when grouping a named passive", () => {
    const bonuses = resolveResonatorBonuses([
      passive({ name: "  Forte  Circuit " }),
      passive({ id: 2, name: "forte circuit" }),
    ])

    expect(bonuses).toHaveLength(1)
    expect(bonuses[0].value).toBe(10)
  })

  test("drops totals that round to zero", () => {
    expect(resolveResonatorBonuses([passive({ value: 0.001 })])).toEqual([])
    expect(resolveResonatorBonuses([passive({ value: -4 })])).toEqual([])
    expect(
      resolveResonatorBonuses([
        passive({ value: 2 }),
        passive({ id: 2, value: -2 }),
      ])
    ).toEqual([])
  })
})
