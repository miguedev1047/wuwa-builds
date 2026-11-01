import { describe, expect, test } from "bun:test"
import type { EncoreProperty } from "@/modules/encore/domain/property"
import { propertyLevelDraftFromEncore } from "@/modules/panel/admin/game-data/views/resonators/detail/application/property-level-draft"

function encoreProperty(
  name: string,
  baseValue: number,
  icon = "icon.webp"
): EncoreProperty {
  return { name, baseValue, icon, growth: [] }
}

describe("propertyLevelDraftFromEncore", () => {
  test("maps the Encore stat names to the panel labels", () => {
    expect(propertyLevelDraftFromEncore(encoreProperty("ATQ", 35))).toEqual({
      name: "Ataque",
      baseValue: 35,
      icon: "icon.webp",
    })
    expect(propertyLevelDraftFromEncore(encoreProperty("PS", 831)).name).toBe(
      "Vida"
    )
    expect(propertyLevelDraftFromEncore(encoreProperty("DEF", 99)).name).toBe(
      "Defensa"
    )
  })

  test("normalizes the percentage stats and the resonance break boost", () => {
    expect(
      propertyLevelDraftFromEncore(encoreProperty("Prob. CRIT", 500))
    ).toEqual({
      name: "Prob. Criti.",
      baseValue: 5,
      icon: "icon.webp",
    })
    expect(
      propertyLevelDraftFromEncore(encoreProperty("Daño CRIT", 15000))
    ).toEqual({
      name: "Dano Crit.",
      baseValue: 150,
      icon: "icon.webp",
    })
    expect(
      propertyLevelDraftFromEncore(
        encoreProperty("Impulso de Ruptura de Tonalidad", 0)
      )
    ).toEqual({
      name: "Impulso de Ruptura de Tonalidad",
      baseValue: 0,
      icon: "icon.webp",
    })
  })

  test("keeps a zero base value and unknown Encore names", () => {
    expect(
      propertyLevelDraftFromEncore(encoreProperty("Nueva propiedad", 0))
    ).toEqual({
      name: "Nueva propiedad",
      baseValue: 0,
      icon: "icon.webp",
    })
  })
})
