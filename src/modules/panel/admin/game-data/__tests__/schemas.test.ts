/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  resonatorInput,
  resonatorPropertyLevelsSchema,
  resonatorTagsInput,
  resonatorTagsSelectionInput,
} from "@/modules/panel/admin/game-data/application/schemas"

const valid = {
  id: 1402,
  name: "  Cartethyia  ",
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

describe("resonatorPropertyLevelsSchema", () => {
  const valid = {
    resonatorId: 1104,
    sortOrder: 1,
    name: "Vida",
    baseValue: 831,
    icon: "https://api-v2.encore.moe/icon.webp",
  }

  test("accepts the property level payload", () => {
    expect(resonatorPropertyLevelsSchema.parse(valid)).toEqual(valid)
  })

  test("accepts a zero base value", () => {
    const result = resonatorPropertyLevelsSchema.safeParse({
      ...valid,
      baseValue: 0,
    })

    expect(result.success).toBe(true)
  })

  test("requires the name and the icon", () => {
    const result = resonatorPropertyLevelsSchema.safeParse({
      ...valid,
      name: "",
      icon: "",
    })

    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
      "name",
      "icon",
    ])
  })

  test("requires a positive sort order", () => {
    expect(
      resonatorPropertyLevelsSchema.safeParse({ ...valid, sortOrder: 0 })
        .success
    ).toBe(false)
  })
})

describe("resonatorTagsInput", () => {
  const tag = (index: number) => ({
    name: `Etiqueta ${index}`,
    description: "",
    color: "",
    icon: "",
  })

  test("accepts up to eight tags", () => {
    const tags = Array.from({ length: 8 }, (_, index) => tag(index))

    expect(resonatorTagsInput.safeParse({ resonatorId: 1, tags }).success).toBe(
      true
    )
  })

  test("rejects more than eight tags", () => {
    const tags = Array.from({ length: 9 }, (_, index) => tag(index))
    const result = resonatorTagsInput.safeParse({ resonatorId: 1, tags })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe("Maximo 8 etiquetas")
  })
})

describe("resonatorTagsSelectionInput", () => {
  test("rejects empty tag names", () => {
    expect(
      resonatorTagsSelectionInput.safeParse({ tags: ["  "] }).success
    ).toBe(false)
  })

  test("accepts a list of names", () => {
    const result = resonatorTagsSelectionInput.safeParse({ tags: ["Curación"] })

    expect(result.success).toBe(true)
    expect(result.data?.tags).toEqual(["Curación"])
  })
})
