/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  weaponTypeMatches,
  weaponTypeNumber,
} from "@catalog/application/weapons/types"

describe("weapon type normalization", () => {
  test("maps canonical ids to catalog numbers", () => {
    expect(weaponTypeNumber("sword")).toBe(2)
    expect(weaponTypeNumber("rectifier")).toBe(5)
    expect(weaponTypeNumber("")).toBeNull()
  })

  test("only matches the compatible catalog type", () => {
    expect(weaponTypeMatches("sword", 2)).toBe(true)
    expect(weaponTypeMatches("sword", 1)).toBe(false)
  })

  test("does not hide every weapon for an unknown type", () => {
    expect(weaponTypeMatches("", 1)).toBe(true)
  })
})
