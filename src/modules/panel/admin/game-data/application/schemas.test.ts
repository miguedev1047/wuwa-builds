/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { resonatorInput } from "./schemas"

const valid = {
  id: 1402,
  name: "  Cartethyia  ",
  nickname: " Dama del mar ",
  introduction: "Resonadora de Rinascita",
  rarity: 5,
  element: "Aero",
  weaponType: "Espada",
  icon: "",
}

describe("resonatorInput", () => {
  test("trims text and accepts a valid resonator", () => {
    const parsed = resonatorInput.parse(valid)

    expect(parsed.name).toBe("Cartethyia")
    expect(parsed.nickname).toBe("Dama del mar")
    expect(parsed.rarity).toBe(5)
  })

  test("rejects an empty name", () => {
    const result = resonatorInput.safeParse({ ...valid, name: "   " })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe("El nombre es obligatorio")
  })

  test("rejects a rarity outside 1..5", () => {
    const low = resonatorInput.safeParse({ ...valid, rarity: 0 })
    const high = resonatorInput.safeParse({ ...valid, rarity: 6 })

    expect(low.success).toBe(false)
    expect(high.success).toBe(false)
    expect(high.error?.issues[0]?.message).toBe("La rareza maxima es 5")
  })

  test("requires element and weapon type", () => {
    const result = resonatorInput.safeParse({
      ...valid,
      element: "",
      weaponType: "",
    })

    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
      "element",
      "weaponType",
    ])
  })

  test("requires a positive id", () => {
    const missing = resonatorInput.safeParse({ ...valid, id: 0 })

    expect(missing.success).toBe(false)
    expect(missing.error?.issues[0]?.message).toBe("El ID es requerido")
  })

  test("keeps the id and ignores the database timestamps", () => {
    const parsed = resonatorInput.parse({
      ...valid,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    expect(parsed.id).toBe(1402)
    expect(parsed).not.toHaveProperty("createdAt")
    expect(parsed).not.toHaveProperty("updatedAt")
  })
})
