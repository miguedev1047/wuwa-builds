/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  echoSubstatOptions,
  echoSubstatOptionsExcluding,
  echoSubstatValues,
  formatEchoSubstatValue,
} from "./echo-substats"

describe("echoSubstatOptions", () => {
  test("returns options for a known cost", () => {
    expect(echoSubstatOptions(4).length).toBeGreaterThan(0)
    expect(echoSubstatOptions(2)).toEqual([])
  })
})

describe("echoSubstatValues", () => {
  test("returns the rolls of a selected substat", () => {
    expect(echoSubstatValues(4, "Defensa %")).toEqual([
      8.1, 9.0, 10.0, 10.9, 11.8, 12.8, 13.8, 14.7,
    ])
  })

  test("returns an empty array for an unknown substat", () => {
    expect(echoSubstatValues(4, "Nope")).toEqual([])
  })
})

describe("echoSubstatOptionsExcluding", () => {
  const options = [
    { label: "Vida", values: [1] },
    { label: "Ataque", values: [2] },
    { label: "Defensa", values: [3] },
  ]

  test("hides labels selected by the other rows", () => {
    const result = echoSubstatOptionsExcluding(options, ["Vida"], "Ataque")

    expect(result.map((option) => option.label)).toEqual(["Ataque", "Defensa"])
  })

  test("keeps the current label even when it is selected elsewhere", () => {
    const result = echoSubstatOptionsExcluding(options, ["Vida"], "Vida")

    expect(result.map((option) => option.label)).toEqual([
      "Vida",
      "Ataque",
      "Defensa",
    ])
  })
})

describe("formatEchoSubstatValue", () => {
  test("adds a percent sign to percentage substats", () => {
    expect(formatEchoSubstatValue("Defensa %", 9)).toBe("9%")
    expect(formatEchoSubstatValue("Regeneración de Energía", 10)).toBe("10%")
    expect(formatEchoSubstatValue("Probabilidad Crítico", 6.3)).toBe("6.3%")
  })

  test("keeps flat substats as plain numbers", () => {
    expect(formatEchoSubstatValue("Vida", 320)).toBe("320")
    expect(formatEchoSubstatValue("Ataque", 30)).toBe("30")
  })
})
