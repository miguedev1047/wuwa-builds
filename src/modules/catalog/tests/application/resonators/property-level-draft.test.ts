import { describe, expect, test } from "bun:test"
import type { EncoreProperty } from "@encore/domain/property"
import {
  findEncoreProperty,
  propertyLevelDraftFromEncore,
} from "@catalog/presentation/resonators/detail/application/property-level-draft"

function encoreProperty(
  name: string,
  baseValue: number,
  icon = "icon.webp"
): EncoreProperty {
  return { name, baseValue, icon, growth: [] }
}

describe("propertyLevelDraftFromEncore", () => {
  test("maps the Encore stat names to the canonical ids", () => {
    expect(propertyLevelDraftFromEncore(encoreProperty("ATQ", 35))).toEqual({
      name: "atk",
      baseValue: 35,
      icon: "icon.webp",
    })
    expect(propertyLevelDraftFromEncore(encoreProperty("PS", 831)).name).toBe(
      "hp"
    )
    expect(propertyLevelDraftFromEncore(encoreProperty("DEF", 99)).name).toBe(
      "def"
    )
  })

  test("normalizes the percentage stats and the resonance break boost", () => {
    expect(
      propertyLevelDraftFromEncore(encoreProperty("Prob. CRIT", 500))
    ).toEqual({
      name: "crit_rate",
      baseValue: 5,
      icon: "icon.webp",
    })
    expect(
      propertyLevelDraftFromEncore(encoreProperty("Daño CRIT", 15000))
    ).toEqual({
      name: "crit_dmg",
      baseValue: 150,
      icon: "icon.webp",
    })
    expect(
      propertyLevelDraftFromEncore(
        encoreProperty("Impulso de Ruptura de Tonalidad", 0)
      )
    ).toEqual({
      name: "break_impulse",
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

describe("findEncoreProperty", () => {
  const properties = [
    encoreProperty("ATQ", 35),
    encoreProperty("PS", 824),
    encoreProperty("Prob. CRIT", 500),
  ]

  test("matches a saved stat id with its Encore name", () => {
    expect(findEncoreProperty(properties, "atk")?.name).toBe("ATQ")
    expect(findEncoreProperty(properties, "hp")?.name).toBe("PS")
    expect(findEncoreProperty(properties, "crit_rate")?.name).toBe("Prob. CRIT")
  })
})
