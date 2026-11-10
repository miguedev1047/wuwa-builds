/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  echoMainStatOptions,
  echoMainStatValue,
  echoPrimaryStat,
} from "@builds/application/echo-main-stat"

describe("echoMainStatValue", () => {
  test("returns the value at the echo level breakpoint", () => {
    expect(echoMainStatValue({ cost: 4, stat: "atk_percent", level: 0 })).toBe(
      6.6
    )
    expect(echoMainStatValue({ cost: 4, stat: "atk_percent", level: 25 })).toBe(
      33
    )
  })

  test("maps every five levels to the next array index", () => {
    expect(echoMainStatValue({ cost: 4, stat: "atk_percent", level: 5 })).toBe(
      11.8
    )
    expect(echoMainStatValue({ cost: 4, stat: "atk_percent", level: 10 })).toBe(
      17.2
    )
  })

  test("returns 0 for an unknown stat or cost", () => {
    expect(echoMainStatValue({ cost: 4, stat: "nope", level: 25 })).toBe(0)
    expect(echoMainStatValue({ cost: 2, stat: "atk_percent", level: 25 })).toBe(
      0
    )
  })
})

describe("echoMainStatOptions", () => {
  test("returns the selectable main stats of the echo cost", () => {
    const stats = echoMainStatOptions(4).map((option) => option.stat)

    expect(stats).toContain("crit_rate")
    expect(stats).toContain("atk_percent")
    expect(echoMainStatOptions(2)).toEqual([])
  })
})

describe("echoPrimaryStat", () => {
  test("returns the flat primary stat at the echo level", () => {
    expect(echoPrimaryStat({ cost: 4, level: 0 })).toEqual({
      stat: "atk",
      label: "Ataque",
      value: 30,
    })
    expect(echoPrimaryStat({ cost: 4, level: 25 })).toEqual({
      stat: "atk",
      label: "Ataque",
      value: 150,
    })
    expect(echoPrimaryStat({ cost: 3, level: 10 })).toEqual({
      stat: "atk",
      label: "Ataque",
      value: 52,
    })
    expect(echoPrimaryStat({ cost: 1, level: 0 })).toEqual({
      stat: "hp",
      label: "Vida",
      value: 456,
    })
  })

  test("returns null for an unknown cost", () => {
    expect(echoPrimaryStat({ cost: 2, level: 0 })).toBeNull()
  })
})
