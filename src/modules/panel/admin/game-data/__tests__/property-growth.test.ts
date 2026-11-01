import { describe, expect, test } from "bun:test"
import {
  formatGrowthValue,
  growthValueColumns,
  isGrowthValue,
} from "@/modules/panel/admin/game-data/application/property-growth"

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
