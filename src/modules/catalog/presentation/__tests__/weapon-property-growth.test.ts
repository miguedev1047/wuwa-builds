/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { EncorePropertyGrowth } from "@encore/domain/property"
import {
  formatWeaponGrowthValue,
  isWeaponGrowthValue,
  weaponGrowthMilestoneOptions,
  weaponGrowthPayloads,
  weaponGrowthValueColumns,
  type WeaponGrowthMilestoneOption,
} from "@catalog/application/weapons/property-growth"

const encoreGrowth: EncorePropertyGrowth[] = [
  { level: 1, value: "33.00" },
  { level: 9, value: "72.25" },
  { level: 10, value: "75.63" },
  { level: 20, value: "104.04" },
  { level: 20.5, value: "130.71" },
  { level: 20, value: "104.04" },
  { level: 90, value: "412.50" },
]

describe("isWeaponGrowthValue", () => {
  test("accepts decimals and percentages", () => {
    expect(isWeaponGrowthValue("412.50")).toBe(true)
    expect(isWeaponGrowthValue("0")).toBe(true)
    expect(isWeaponGrowthValue("16.05%")).toBe(true)
  })

  test("rejects empty and non numeric values", () => {
    expect(isWeaponGrowthValue("")).toBe(false)
    expect(isWeaponGrowthValue("   ")).toBe(false)
    expect(isWeaponGrowthValue("%")).toBe(false)
    expect(isWeaponGrowthValue("abc")).toBe(false)
  })
})

describe("weaponGrowthMilestoneOptions", () => {
  test("keeps 1 and every 10 levels, once per level", () => {
    const options = weaponGrowthMilestoneOptions(encoreGrowth, [])

    expect(options.map((option) => option.label)).toEqual([
      "Nivel 1",
      "Nivel 10",
      "Nivel 20",
      "Nivel 90",
    ])
    expect(options.map((option) => option.value)).toEqual(["0", "2", "3", "6"])
    expect(options[2]?.entry.value).toBe("104.04")
  })

  test("hides the levels that already have a saved growth", () => {
    const options = weaponGrowthMilestoneOptions(encoreGrowth, [{ level: 20 }])

    expect(options.map((option) => option.label)).toEqual([
      "Nivel 1",
      "Nivel 10",
      "Nivel 90",
    ])
  })
})

describe("weaponGrowthPayloads", () => {
  const options: WeaponGrowthMilestoneOption[] = [
    { label: "Nivel 1", value: "0", entry: { level: 1, value: "33.00" } },
    { label: "Nivel 10", value: "2", entry: { level: 10, value: "75.63" } },
    { label: "Nivel 20", value: "3", entry: { level: 20, value: "104.04" } },
  ]

  test("expands the selected milestones with sequential sort orders", () => {
    expect(
      weaponGrowthPayloads(
        {
          propertyId: 5,
          sortOrder: 4,
          level: 1,
          value: "",
          encoreLevels: ["0", "3"],
        },
        options
      )
    ).toEqual([
      { propertyId: 5, sortOrder: 4, level: 1, value: "33.00" },
      { propertyId: 5, sortOrder: 5, level: 20, value: "104.04" },
    ])
  })

  test("uses the manual values when no milestone is selected", () => {
    expect(
      weaponGrowthPayloads(
        {
          propertyId: 5,
          sortOrder: 4,
          level: 45,
          value: "16.05%",
          encoreLevels: [],
        },
        options
      )
    ).toEqual([{ propertyId: 5, sortOrder: 4, level: 45, value: "16.05%" }])
  })
})

describe("weaponGrowthValueColumns", () => {
  test("stores every value verbatim in valueText", () => {
    expect(weaponGrowthValueColumns(" 412.50 ")).toEqual({
      valueNumber: null,
      valueText: "412.50",
    })
    expect(weaponGrowthValueColumns("16.05%")).toEqual({
      valueNumber: null,
      valueText: "16.05%",
    })
  })
})

describe("formatWeaponGrowthValue", () => {
  test("preserves decimals and percentages", () => {
    expect(
      formatWeaponGrowthValue({ valueText: "412.50", valueNumber: null })
    ).toBe("412.50")
    expect(
      formatWeaponGrowthValue({ valueText: "16.05%", valueNumber: null })
    ).toBe("16.05%")
  })

  test("falls back to the numeric column", () => {
    expect(formatWeaponGrowthValue({ valueText: null, valueNumber: 33 })).toBe(
      "33"
    )
    expect(
      formatWeaponGrowthValue({ valueText: null, valueNumber: null })
    ).toBe("")
  })
})
