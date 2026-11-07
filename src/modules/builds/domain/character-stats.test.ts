/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { calculateCharacterStats } from "./character-stats"
import type { CharacterBaseStats } from "./character-stats"

const base: CharacterBaseStats = {
  hp: 1000,
  atk: 100,
  def: 50,
  critRate: 5,
  critDmg: 150,
  energyRegen: 100,
}

describe("calculateCharacterStats", () => {
  test("returns the resolved base stats and six empty elements", () => {
    const result = calculateCharacterStats({
      base,
      weaponBaseAtk: 50,
      bonuses: [],
    })

    expect(result.stats.hp).toBe(1000)
    expect(result.stats.atk).toBe(150)
    expect(result.stats.def).toBe(50)
    expect(result.stats.critRate).toBe(5)
    expect(result.stats.critDmg).toBe(150)
    expect(result.stats.energyRegen).toBe(100)
    expect(result.stats.elementDmgBonus).toEqual({
      glacio: 0,
      fusion: 0,
      electro: 0,
      aero: 0,
      spectro: 0,
      havoc: 0,
    })
    expect(result.diagnostics).toEqual([])
    expect(result.unmappedBonuses).toEqual([])
  })

  test("applies flat and percent bonuses to the correct base", () => {
    const result = calculateCharacterStats({
      base,
      weaponBaseAtk: 50,
      bonuses: [
        { statId: "atk_percent", value: 20 },
        { statId: "atk", value: 30 },
        { statId: "hp_percent", value: 10 },
        { statId: "def_percent", value: 20 },
      ],
    })

    expect(result.stats.atk).toBe(210)
    expect(result.stats.hp).toBe(1100)
    expect(result.stats.def).toBe(60)
  })

  test("keeps percentages as display points without rounding", () => {
    const result = calculateCharacterStats({
      base,
      weaponBaseAtk: 0,
      bonuses: [
        { statId: "crit_rate", value: 22.4 },
        { statId: "crit_dmg", value: 44.8 },
        { statId: "energy_regen", value: 6.8 },
      ],
    })

    expect(result.stats.critRate).toBe(27.4)
    expect(result.stats.critDmg).toBe(194.8)
    expect(result.stats.energyRegen).toBe(106.8)
  })

  test("adds energy regen bonuses to the 100% base", () => {
    const result = calculateCharacterStats({
      base,
      weaponBaseAtk: 0,
      bonuses: [{ statId: "energy_regen", value: 18.4 }],
    })

    expect(result.stats.energyRegen).toBe(118.4)
  })

  test("maps damage and element keys to their contract fields", () => {
    const result = calculateCharacterStats({
      base,
      weaponBaseAtk: 0,
      bonuses: [
        { statId: "basic_atk_bonus", value: 10 },
        { statId: "heavy_atk_bonus", value: 20 },
        { statId: "skill_bonus", value: 30 },
        { statId: "liberation_bonus", value: 40 },
        { statId: "aero_dmg", value: 15 },
        { statId: "havoc_dmg", value: 5 },
        { statId: "healing_bonus", value: 12 },
      ],
    })

    expect(result.stats.basicDmg).toBe(10)
    expect(result.stats.heavyDmg).toBe(20)
    expect(result.stats.skillDmg).toBe(30)
    expect(result.stats.liberationDmg).toBe(40)
    expect(result.stats.healingBonus).toBe(12)
    expect(result.stats.elementDmgBonus.aero).toBe(15)
    expect(result.stats.elementDmgBonus.havoc).toBe(5)
    expect(result.stats.elementDmgBonus.glacio).toBe(0)
  })

  test("reports unknown and out-of-contract stats instead of dropping them", () => {
    const result = calculateCharacterStats({
      base,
      weaponBaseAtk: 0,
      bonuses: [
        { statId: "echo_skill_bonus", value: 10 },
        { statId: "break_impulse", value: 20 },
        { statId: "not_a_stat", value: 30 },
      ],
    })

    expect(result.stats.hp).toBe(1000)
    expect(result.diagnostics).toEqual([
      "echo_skill_bonus is not part of CharacterStats",
      "break_impulse is not part of CharacterStats",
      "Unknown stat: not_a_stat",
    ])
    expect(result.unmappedBonuses).toEqual([
      { statId: "echo_skill_bonus", value: 10 },
      { statId: "break_impulse", value: 20 },
      { statId: "not_a_stat", value: 30 },
    ])
  })

  test("exposes a contribution trace with source, kind and applied flag", () => {
    const result = calculateCharacterStats({
      base,
      weaponBaseAtk: 50,
      bonuses: [
        { statId: "atk_percent", value: 20, source: "Arma" },
        { statId: "echo_skill_bonus", value: 10, source: "Eco" },
      ],
    })

    expect(result.trace.base).toEqual(base)
    expect(result.trace.weaponBaseAtk).toBe(50)
    expect(result.trace.totals).toBe(result.stats)
    expect(result.trace.totalsByStat).toEqual({ atk_percent: 20 })
    expect(result.trace.contributions).toEqual([
      {
        statId: "atk_percent",
        value: 20,
        kind: "percent",
        source: "Arma",
        applied: true,
      },
      {
        statId: "echo_skill_bonus",
        value: 10,
        kind: "percent",
        source: "Eco",
        applied: false,
      },
    ])
  })

  test("golden: Cartethyia full build matches the game rounding", () => {
    const result = calculateCharacterStats({
      base: {
        hp: 14800,
        atk: 312.5,
        def: 611.11,
        critRate: 5,
        critDmg: 150,
        energyRegen: 100,
      },
      weaponBaseAtk: 412.5,
      bonuses: [
        { statId: "crit_rate", value: 1.2 },
        { statId: "hp_percent", value: 1.8 },
        { statId: "hp_percent", value: 1.8 },
        { statId: "crit_rate", value: 1.2 },
        { statId: "crit_rate", value: 2.8 },
        { statId: "hp_percent", value: 4.2 },
        { statId: "hp_percent", value: 4.2 },
        { statId: "crit_rate", value: 2.8 },
        { statId: "hp_percent", value: 72.2 },
        { statId: "hp_percent", value: 12 },
        { statId: "atk", value: 150 },
        { statId: "crit_rate", value: 22 },
        { statId: "skill_bonus", value: 8.6 },
        { statId: "hp_percent", value: 6.4 },
        { statId: "heavy_atk_bonus", value: 8.6 },
        { statId: "crit_dmg", value: 18.6 },
        { statId: "basic_atk_bonus", value: 8.6 },
        { statId: "atk", value: 150 },
        { statId: "crit_dmg", value: 44 },
        { statId: "crit_dmg", value: 12.6 },
        { statId: "crit_rate", value: 6.9 },
        { statId: "hp", value: 390 },
        { statId: "energy_regen", value: 9.2 },
        { statId: "def", value: 60 },
        { statId: "hp", value: 2280 },
        { statId: "hp_percent", value: 22.8 },
        { statId: "heavy_atk_bonus", value: 10.9 },
        { statId: "hp_percent", value: 7.1 },
        { statId: "crit_dmg", value: 13.8 },
        { statId: "liberation_bonus", value: 8.6 },
        { statId: "crit_rate", value: 6.3 },
        { statId: "hp", value: 2280 },
        { statId: "hp_percent", value: 22.8 },
        { statId: "atk_percent", value: 8.6 },
        { statId: "crit_dmg", value: 18.6 },
        { statId: "crit_rate", value: 9.9 },
        { statId: "heavy_atk_bonus", value: 8.6 },
        { statId: "hp_percent", value: 7.9 },
        { statId: "hp", value: 2280 },
        { statId: "hp_percent", value: 22.8 },
        { statId: "energy_regen", value: 9.2 },
        { statId: "hp_percent", value: 7.9 },
        { statId: "crit_rate", value: 7.5 },
        { statId: "atk_percent", value: 7.9 },
        { statId: "crit_dmg", value: 12.6 },
        { statId: "aero_dmg", value: 10 },
        { statId: "aero_dmg", value: 10 },
        { statId: "aero_dmg", value: 10 },
      ],
    })

    expect(result.stats.hp).toBe(50722)
    expect(result.stats.atk).toBe(1143)
    expect(result.stats.def).toBe(671)
    expect(result.stats.critRate).toBeCloseTo(65.6, 5)
    expect(result.stats.critDmg).toBeCloseTo(270.2, 5)
    expect(result.stats.energyRegen).toBe(118.4)
    expect(result.trace.effectiveBase.atk).toBe(312)
    expect(result.trace.effectiveWeaponBaseAtk).toBe(412)
  })

  test("carries input diagnostics and conditional effects through", () => {
    const result = calculateCharacterStats({
      base,
      weaponBaseAtk: 0,
      bonuses: [],
      diagnostics: ["Unknown resonator property: Foo"],
      conditionalEffects: [{ source: "Pasiva", description: "Activa" }],
    })

    expect(result.diagnostics).toEqual(["Unknown resonator property: Foo"])
    expect(result.conditionalEffects).toEqual([
      { source: "Pasiva", description: "Activa" },
    ])
  })
})
