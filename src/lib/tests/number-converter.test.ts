import { describe, expect, test } from "bun:test"
import { numberConverter } from "@/lib/number-converter"

describe("numberConverter", () => {
  test("extracts the first signed decimal", () => {
    expect(numberConverter({ input: "ATQ +1.80%" })).toBe(1.8)
    expect(numberConverter({ input: "DEF +12%" })).toBe(12)
    expect(numberConverter({ input: "-2.5%" })).toBe(-2.5)
  })

  test("returns zero when the text has no number", () => {
    expect(numberConverter({ input: "Sin valor" })).toBe(0)
    expect(numberConverter({ input: "" })).toBe(0)
  })
})
