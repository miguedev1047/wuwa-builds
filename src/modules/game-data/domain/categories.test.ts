import { describe, expect, test } from "bun:test"
import {
  ELEMENTS,
  WEAPON_TYPES,
  ECHO_CLASSES,
  elementSchema,
  weaponTypeSchema,
  echoClassSchema,
  raritySchema,
  echoCostSchema,
} from "@/modules/game-data/domain/categories"
import {
  elementParser,
  weaponTypeParser,
  echoClassParser,
} from "@/modules/game-data/presentation/category-parsers"

/** The stable ids survive locale changes; translated text belongs at the boundary. */
describe("category contracts", () => {
  test("canonical schemas accept ids and reject labels and unknown codes", () => {
    for (const [options, schema] of [
      [ELEMENTS, elementSchema],
      [WEAPON_TYPES, weaponTypeSchema],
      [ECHO_CLASSES, echoClassSchema],
    ] as const) {
      for (const option of options) {
        expect(schema.safeParse(option.value).success).toBe(true)
        expect(schema.safeParse(option.label).success).toBe(false)
      }
      expect(schema.safeParse("unknown").success).toBe(false)
      expect(schema.safeParse(999).success).toBe(false)
    }
    expect(weaponTypeSchema.safeParse(4).success).toBe(false)
    expect(weaponTypeSchema.safeParse("guantlets").success).toBe(false)
    expect(echoClassSchema.safeParse(1).success).toBe(false)
    expect(raritySchema.safeParse(4).success).toBe(true)
    expect(raritySchema.safeParse(4.5).success).toBe(false)
    expect(echoCostSchema.safeParse(2).success).toBe(false)
  })

  test("URL filters reject old codes, translated labels and misspelled ids", () => {
    expect(weaponTypeParser.parse("4")).toBeNull()
    expect(weaponTypeParser.parse("guantlets")).toBeNull()
    expect(weaponTypeParser.parse("Brazales")).toBeNull()
    expect(echoClassParser.parse("0")).toBeNull()
    expect(elementParser.parse("Fusión")).toBeNull()
    expect(weaponTypeParser.parse("gauntlets")).toBe("gauntlets")
    expect(echoClassParser.parse("elite")).toBe("elite")
    expect(elementParser.parse("fusion")).toBe("fusion")
  })
})
