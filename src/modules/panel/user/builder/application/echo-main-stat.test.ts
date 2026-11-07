/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { echoMainStatOptions, echoMainStatValue } from "./echo-main-stat"

describe("echoMainStatValue", () => {
  test("returns the value at the echo level breakpoint", () => {
    expect(echoMainStatValue({ cost: 4, label: "Ataque %", level: 0 })).toBe(
      6.6
    )
    expect(echoMainStatValue({ cost: 4, label: "Ataque %", level: 25 })).toBe(
      33
    )
  })

  test("returns 0 for an unknown label or cost", () => {
    expect(echoMainStatValue({ cost: 4, label: "Nope", level: 25 })).toBe(0)
    expect(echoMainStatValue({ cost: 2, label: "Ataque %", level: 25 })).toBe(0)
  })
})

describe("echoMainStatOptions", () => {
  test("returns the options of the echo cost", () => {
    expect(echoMainStatOptions(4).length).toBeGreaterThan(0)
    expect(echoMainStatOptions(2)).toEqual([])
  })
})
