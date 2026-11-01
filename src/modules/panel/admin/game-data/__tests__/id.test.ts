import { describe, expect, test } from "bun:test"
import { isValidId } from "@/modules/panel/admin/game-data/application/id"

describe("isValidId", () => {
  test("accepts positive integers", () => {
    expect(isValidId(1)).toBe(true)
    expect(isValidId(1311)).toBe(true)
  })

  test("rejects zero, negative and fractional ids", () => {
    expect(isValidId(0)).toBe(false)
    expect(isValidId(-1)).toBe(false)
    expect(isValidId(1.5)).toBe(false)
    expect(isValidId(Number.NaN)).toBe(false)
  })
})
