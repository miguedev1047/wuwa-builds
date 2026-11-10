/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  echoSubstatOptions,
  echoSubstatOptionsExcluding,
  echoSubstatValues,
  formatEchoSubstatValue,
} from "@builds/application/echo-substats"

describe("echoSubstatOptions", () => {
  test("returns options for a known cost", () => {
    expect(echoSubstatOptions(4).length).toBeGreaterThan(0)
    expect(echoSubstatOptions(2)).toEqual([])
  })
})

describe("echoSubstatValues", () => {
  test("returns the rolls of a selected substat", () => {
    expect(echoSubstatValues(4, "def_percent")).toEqual([
      8.1, 9.0, 10.0, 10.9, 11.8, 12.8, 13.8, 14.7,
    ])
  })

  test("returns an empty array for an unknown substat", () => {
    expect(echoSubstatValues(4, "nope")).toEqual([])
  })
})

describe("echoSubstatOptionsExcluding", () => {
  const options = [
    { stat: "hp", label: "Vida", values: [1] },
    { stat: "atk", label: "Ataque", values: [2] },
    { stat: "def", label: "Defensa", values: [3] },
  ]

  test("hides stats selected by the other rows", () => {
    const result = echoSubstatOptionsExcluding(options, ["hp"], "atk")

    expect(result.map((option) => option.label)).toEqual(["Ataque", "Defensa"])
  })

  test("keeps the current stat even when it is selected elsewhere", () => {
    const result = echoSubstatOptionsExcluding(options, ["hp"], "hp")

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
    expect(formatEchoSubstatValue("Regen. de Energía", 10)).toBe("10%")
    expect(formatEchoSubstatValue("Prob. Crít.", 6.3)).toBe("6.3%")
  })

  test("keeps flat substats as plain numbers", () => {
    expect(formatEchoSubstatValue("Vida", 320)).toBe("320")
    expect(formatEchoSubstatValue("Ataque", 30)).toBe("30")
  })
})
