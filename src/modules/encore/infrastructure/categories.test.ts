import { describe, expect, test } from "bun:test"
import {
  encoreElementId,
  encoreWeaponTypeIdFromName,
  encoreWeaponTypeId,
  encoreEchoTier,
} from "@encore/infrastructure/categories.server"

describe("Encore category mapping", () => {
  test("converts localized source names and numeric source codes", () => {
    expect(encoreElementId("Fusión")).toBe("fusion")
    expect(encoreElementId("Fusion")).toBe("fusion")
    expect(encoreWeaponTypeIdFromName("Brazales")).toBe("gauntlets")
    expect(encoreWeaponTypeIdFromName("Gauntlets")).toBe("gauntlets")
    expect(encoreWeaponTypeId(4)).toBe("gauntlets")
    expect(encoreEchoTier(0)).toEqual({ class: "common", cost: 1 })
    expect(encoreEchoTier(3)).toEqual({ class: "calamity", cost: 4 })
  })

  test("rejects internal ids and old spellings as external wire values", () => {
    expect(() => encoreElementId("fusion")).toThrow()
    expect(() => encoreWeaponTypeIdFromName("guantlets")).toThrow()
    expect(() => encoreWeaponTypeId("4")).toThrow()
    expect(() => encoreWeaponTypeId("gauntlets")).toThrow()
    expect(() => encoreEchoTier("common")).toThrow()
    expect(() => encoreEchoTier(undefined)).toThrow()
    expect(() => encoreEchoTier(99)).toThrow()
    expect(() => encoreWeaponTypeId(0)).toThrow()
  })
})
