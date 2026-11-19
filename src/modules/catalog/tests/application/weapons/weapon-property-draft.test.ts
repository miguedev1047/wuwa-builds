/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { EncoreProperty } from "@encore/domain/property"
import {
  findEncoreWeaponProperty,
  weaponPropertyDraftFromEncore,
  weaponPropertyOptions,
  weaponPropertyPayloads,
} from "@catalog/presentation/weapons/detail/application/weapon-property-draft"
import { statLabel } from "@catalog/application/stats/stats"

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
      name: "atk",
      baseValue: 33,
      icon: "icon.webp",
    })
  })

  test("normalizes the percentage attack substat", () => {
    expect(
      weaponPropertyDraftFromEncore(encoreProperty("ATQ", 0.081, "8.10%"))
    ).toEqual({
      name: "atk_percent",
      baseValue: 8.1,
      icon: "icon.webp",
    })
  })

  test("normalizes the fraction-based percentage stats", () => {
    expect(
      weaponPropertyDraftFromEncore(
        encoreProperty("PS", 0.16050000488758087, "16.05%")
      )
    ).toEqual({ name: "hp_percent", baseValue: 16.05, icon: "icon.webp" })

    expect(
      weaponPropertyDraftFromEncore(
        encoreProperty("DEF", 0.08550000190734863, "8.55%")
      ).baseValue
    ).toBe(8.55)
  })

  test("normalizes the percentages Encore sends multiplied by 100", () => {
    expect(
      weaponPropertyDraftFromEncore(encoreProperty("Prob. CRIT", 450, "4.50%"))
    ).toMatchObject({ name: "crit_rate", baseValue: 4.5 })

    expect(
      weaponPropertyDraftFromEncore(encoreProperty("Daño CRIT", 900, "9.00%"))
    ).toMatchObject({ name: "crit_dmg", baseValue: 9 })

    expect(
      weaponPropertyDraftFromEncore(
        encoreProperty("Regen. de energía", 1152, "11.52%")
      )
    ).toMatchObject({ name: "energy_regen", baseValue: 11.52 })
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
    expect(findEncoreWeaponProperty(properties, "atk")?.baseValue).toBe(33)
    expect(findEncoreWeaponProperty(properties, "atk_percent")?.baseValue).toBe(
      0.081
    )
  })

  test("matches a stored label with its Encore name", () => {
    expect(findEncoreWeaponProperty(properties, "hp_percent")?.name).toBe("PS")
  })

  test("falls back to the raw name and returns undefined for unknown stats", () => {
    expect(findEncoreWeaponProperty(properties, "PS")?.name).toBe("PS")
    expect(findEncoreWeaponProperty(properties, "Desconocida")).toBeUndefined()
  })
})

describe("weaponPropertyOptions", () => {
  const properties = [
    encoreProperty("ATQ", 33, "33.00"),
    encoreProperty("PS", 0.1605, "16.05%"),
  ]

  test("offers the Encore stats the weapon does not have yet", () => {
    const options = weaponPropertyOptions(properties, ["hp_percent"])

    expect(options).toHaveLength(1)
    expect(options[0].value).toBe("0")
    expect(options[0].draft.name).toBe("atk")
    expect(options[0].label).toBe(statLabel("atk"))
  })
})

describe("weaponPropertyPayloads", () => {
  const properties = [
    encoreProperty("ATQ", 33, "33.00"),
    encoreProperty("PS", 0.1605, "16.05%"),
  ]

  test("expands the selected stats with consecutive sort orders", () => {
    const options = weaponPropertyOptions(properties, [])

    expect(
      weaponPropertyPayloads(
        {
          weaponId: 9,
          sortOrder: 2,
          name: "",
          baseValue: 0,
          icon: "",
          encoreProperties: ["0", "1"],
        },
        options
      )
    ).toEqual([
      {
        weaponId: 9,
        sortOrder: 2,
        name: "atk",
        baseValue: 33,
        icon: "icon.webp",
      },
      {
        weaponId: 9,
        sortOrder: 3,
        name: "hp_percent",
        baseValue: 16.05,
        icon: "icon.webp",
      },
    ])
  })

  test("falls back to the manual entry", () => {
    expect(
      weaponPropertyPayloads(
        {
          weaponId: 9,
          sortOrder: 4,
          name: "atk",
          baseValue: 12,
          icon: "manual.webp",
          encoreProperties: [],
        },
        []
      )
    ).toEqual([
      {
        weaponId: 9,
        sortOrder: 4,
        name: "atk",
        baseValue: 12,
        icon: "manual.webp",
      },
    ])
  })
})
