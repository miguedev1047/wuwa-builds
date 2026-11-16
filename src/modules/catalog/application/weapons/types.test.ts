import { describe, expect, test } from "bun:test"
import { weaponTypeMatches } from "@catalog/application/weapons/types"

describe("weapon compatibility", () => {
  test("compares canonical ids directly", () => {
    expect(weaponTypeMatches("sword", "sword")).toBe(true)
    expect(weaponTypeMatches("sword", "broadblade")).toBe(false)
  })
})
