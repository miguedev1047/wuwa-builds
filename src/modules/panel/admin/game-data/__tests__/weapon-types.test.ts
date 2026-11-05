/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  WEAPON_TYPES,
  weaponTypeName,
} from "@/modules/game-data/application/weapons/types"

describe("weaponTypeName", () => {
  test("maps every known type id to its stored display name", () => {
    expect(WEAPON_TYPES.map((item) => weaponTypeName(item.value))).toEqual([
      "Mandoble",
      "Espada",
      "Pistolas",
      "Brazales",
      "Rectificador",
    ])
  })

  test("returns an empty name for an unknown type", () => {
    expect(weaponTypeName(0)).toBe("")
    expect(weaponTypeName(9)).toBe("")
  })
})
