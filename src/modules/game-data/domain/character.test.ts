/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { growthValueAtLevel } from "./character"

function growth(level: number, value: number | string) {
  return {
    level,
    valueNumber: typeof value === "number" ? value : null,
    valueText: typeof value === "string" ? value : null,
  }
}

describe("growthValueAtLevel", () => {
  test("returns the exact milestone value", () => {
    const rows = [growth(1, 100), growth(10, 200), growth(20, 300)]

    expect(growthValueAtLevel(rows, 10)).toBe(200)
  })

  test("returns the latest lower level when the exact one is missing", () => {
    const rows = [growth(1, 100), growth(10, 200)]

    expect(growthValueAtLevel(rows, 15)).toBe(200)
  })

  test("preserves percentage strings and handles empty growth", () => {
    expect(growthValueAtLevel([growth(1, "5%")], 1)).toBe("5%")
    expect(growthValueAtLevel([], 90)).toBe(0)
  })
})
