/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { echoListRows } from "@encore/infrastructure/mapper.server"

const echo = {
  Id: 6000038,
  Name: "Campemico",
  Rarity: 0,
  Type: "Eco",
}

describe("echoListRows", () => {
  test("reads the current Echo key", () => {
    expect(echoListRows({ Echo: [echo] })).toEqual([echo])
  })

  test("still reads the older phantomsList key", () => {
    expect(echoListRows({ phantomsList: [echo] })).toEqual([echo])
  })

  test("prefers Echo when both keys are present", () => {
    const other = { ...echo, Id: 1 }

    expect(echoListRows({ Echo: [echo], phantomsList: [other] })).toEqual([
      echo,
    ])
  })

  test("returns an empty list when the shape is unknown", () => {
    expect(echoListRows({})).toEqual([])
  })
})
