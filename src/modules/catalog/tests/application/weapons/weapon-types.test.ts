/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  WEAPON_TYPES,
  weaponTypeName,
} from "@catalog/application/weapons/types"

describe("weaponTypeName", () => {
  test("maps every known type id to its display label", () => {
    expect(WEAPON_TYPES.map((item) => weaponTypeName(item.value))).toEqual([
      "Mandoble",
      "Espada",
      "Pistolas",
      "Brazales",
      "Rectificador",
    ])
  })

  test("resolves canonical gauntlet and sword labels", () => {
    expect(weaponTypeName("gauntlets")).toBe("Brazales")
    expect(weaponTypeName("sword")).toBe("Espada")
  })
})
