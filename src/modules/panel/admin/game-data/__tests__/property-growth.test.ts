import { describe, expect, test } from "bun:test"
import type { EncorePropertyGrowth } from "@/modules/encore/domain/property"
import {
  formatGrowthValue,
  growthMilestoneOptions,
  growthValueColumns,
  isGrowthValue,
} from "@/modules/panel/admin/game-data/application/property-growth"

const encoreGrowth: EncorePropertyGrowth[] = [
  { level: 1, value: 824 },
  { level: 9, value: 1300 },
  { level: 10, value: 1448 },
  { level: 20, value: 2143 },
  { level: 20, value: 2692 },
  { level: 30, value: 3386 },
  { level: 90, value: 10300 },
]

describe("isGrowthValue", () => {
  test("accepts numbers and percentages", () => {
    expect(isGrowthValue("824")).toBe(true)
    expect(isGrowthValue("513.6")).toBe(true)
    expect(isGrowthValue("0")).toBe(true)
    expect(isGrowthValue("5%")).toBe(true)
    expect(isGrowthValue("5.2%")).toBe(true)
  })

  test("rejects empty and non numeric values", () => {
    expect(isGrowthValue("")).toBe(false)
    expect(isGrowthValue("   ")).toBe(false)
    expect(isGrowthValue("%")).toBe(false)
    expect(isGrowthValue("abc")).toBe(false)
    expect(isGrowthValue("5%%")).toBe(false)
  })
})

describe("growthMilestoneOptions", () => {
  test("keeps 1 and every 10 levels, once per level", () => {
    const options = growthMilestoneOptions(encoreGrowth, [])

    expect(options.map((option) => option.label)).toEqual([
      "Nivel 1",
      "Nivel 10",
      "Nivel 20",
      "Nivel 30",
      "Nivel 90",
    ])
    expect(options.map((option) => option.value)).toEqual([
      "0",
      "2",
      "3",
      "5",
      "6",
    ])
    expect(options[2]?.entry.value).toBe(2143)
  })

  test("hides the levels that already have a saved growth", () => {
    const options = growthMilestoneOptions(encoreGrowth, [
      { level: 20 },
      { level: 30 },
    ])

    expect(options.map((option) => option.label)).toEqual([
      "Nivel 1",
      "Nivel 10",
      "Nivel 90",
    ])
  })
})

describe("growthValueColumns", () => {
  test("stores plain numbers in valueNumber", () => {
    expect(growthValueColumns(" 824 ")).toEqual({
      valueNumber: 824,
      valueText: null,
    })
  })

  test("stores percentages in valueText", () => {
    expect(growthValueColumns("5.2%")).toEqual({
      valueNumber: null,
      valueText: "5.2%",
    })
  })
})

describe("formatGrowthValue", () => {
  test("prefers the text column and preserves a stored zero", () => {
    expect(formatGrowthValue({ valueText: "5%", valueNumber: null })).toBe("5%")
    expect(formatGrowthValue({ valueText: null, valueNumber: 0 })).toBe("0")
    expect(formatGrowthValue({ valueText: null, valueNumber: 824 })).toBe("824")
    expect(formatGrowthValue({ valueText: null, valueNumber: null })).toBe("")
  })
})
