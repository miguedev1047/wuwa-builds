/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { EncoreProperty } from "@/modules/encore/domain/property"
import {
  findEncoreWeaponProperty,
  weaponPropertyDraftFromEncore,
} from "@/modules/panel/admin/game-data/views/weapons/detail/application/weapon-property-draft"

function encoreProperty(
  name: string,
  baseValue: number,
  firstValue: string,
  icon = "icon.webp"
): EncoreProperty {
  return {
    name,
    baseValue,
    icon,
    growth: [{ level: 1, value: firstValue }],
  }
}

describe("weaponPropertyDraftFromEncore", () => {
  test("keeps the flat attack stat as-is", () => {
    expect(
      weaponPropertyDraftFromEncore(encoreProperty("ATQ", 33, "33.00"))
    ).toEqual({
      name: "Ataque",
      baseValue: 33,
      icon: "icon.webp",
    })
  })

  test("normalizes the percentage attack substat", () => {
    expect(
      weaponPropertyDraftFromEncore(encoreProperty("ATQ", 0.081, "8.10%"))
    ).toEqual({
      name: "Ataque %",
      baseValue: 8.1,
      icon: "icon.webp",
    })
  })

  test("normalizes the fraction-based percentage stats", () => {
    expect(
      weaponPropertyDraftFromEncore(
        encoreProperty("PS", 0.16050000488758087, "16.05%")
      )
    ).toEqual({ name: "Vida %", baseValue: 16.05, icon: "icon.webp" })

    expect(
      weaponPropertyDraftFromEncore(
        encoreProperty("DEF", 0.08550000190734863, "8.55%")
      ).baseValue
    ).toBe(8.55)
  })

  test("normalizes the percentages Encore sends multiplied by 100", () => {
    expect(
      weaponPropertyDraftFromEncore(encoreProperty("Prob. CRIT", 450, "4.50%"))
    ).toMatchObject({ name: "Prob. Crit.", baseValue: 4.5 })

    expect(
      weaponPropertyDraftFromEncore(encoreProperty("Daño CRIT", 900, "9.00%"))
    ).toMatchObject({ name: "Daño Crit.", baseValue: 9 })

    expect(
      weaponPropertyDraftFromEncore(
        encoreProperty("Regen. de energía", 1152, "11.52%")
      )
    ).toMatchObject({ name: "Recarga de energía", baseValue: 11.52 })
  })

  test("keeps unknown stats with a percentage suffix", () => {
    expect(
      weaponPropertyDraftFromEncore(encoreProperty("Nueva", 0.075, "7.50%"))
    ).toEqual({
      name: "Nueva %",
      baseValue: 7.5,
      icon: "icon.webp",
    })
  })
})

describe("findEncoreWeaponProperty", () => {
  const properties = [
    encoreProperty("ATQ", 33, "33.00"),
    encoreProperty("ATQ", 0.081, "8.10%"),
    encoreProperty("PS", 0.0675, "6.75%"),
  ]

  test("distinguishes the flat attack from the attack percentage", () => {
    expect(findEncoreWeaponProperty(properties, "Ataque")?.baseValue).toBe(33)
    expect(findEncoreWeaponProperty(properties, "Ataque %")?.baseValue).toBe(
      0.081
    )
  })

  test("matches a stored label with its Encore name", () => {
    expect(findEncoreWeaponProperty(properties, "Vida %")?.name).toBe("PS")
  })

  test("falls back to the raw name and returns undefined for unknown stats", () => {
    expect(findEncoreWeaponProperty(properties, "PS")?.name).toBe("PS")
    expect(findEncoreWeaponProperty(properties, "Desconocida")).toBeUndefined()
  })
})
