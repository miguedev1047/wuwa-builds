/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { weaponRarityLabel } from "@catalog/application/constants/weapon"

describe("weaponRarityLabel", () => {
  test("maps every catalog rarity to its label", () => {
    expect([5, 4, 3, 2, 1].map(weaponRarityLabel)).toEqual([
      "5 Estrellas",
      "4 Estrellas",
      "3 Estrellas",
      "2 Estrellas",
      "1 Estrella",
    ])
  })

  test("falls back to the raw value for an unknown rarity", () => {
    expect(weaponRarityLabel(0)).toBe("0 Estrellas")
  })
})
