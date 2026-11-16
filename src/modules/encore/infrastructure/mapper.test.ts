/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  echoListRows,
  toCharacterSummary,
  toCharacterDetail,
  toWeaponSummary,
  toWeaponDetail,
  toEchoSummary,
} from "@encore/infrastructure/mapper.server"

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

describe("canonical categories at the Encore boundary", () => {
  test("normalizes localized character lists and details to the same ids", () => {
    const summary = toCharacterSummary({
      Id: 1204,
      Name: "Mortefi",
      QualityId: 4,
      Element: { Name: "Fusión" },
      WeaponType: { Name: "Pistolas" },
    })
    const detail = toCharacterDetail({
      Id: 1204,
      Name: { Content: "Mortefi" },
      QualityId: 4,
      ElementName: "Fusion",
      WeaponTypeName: "Pistols",
    })
    expect(summary.element).toBe("fusion")
    expect(summary.weaponType).toBe("pistols")
    expect(detail.element).toBe(summary.element)
    expect(detail.weaponType).toBe(summary.weaponType)
  })

  test("normalizes weapon lists and details and derives no redundant name", () => {
    const summary = toWeaponSummary({
      Id: 1,
      Name: "Arma",
      QualityId: 4,
      Type: 1,
    })
    const detail = toWeaponDetail({
      ItemId: 1,
      WeaponName: "Arma",
      QualityId: 4,
      WeaponType: 1,
    })
    expect(summary.type).toBe("broadblade")
    expect(detail.type).toBe(summary.type)
    expect(detail).not.toHaveProperty("typeName")
  })

  test("rejects missing and unknown categories rather than assigning a default", () => {
    expect(() =>
      toCharacterSummary({ Id: 1, Name: "Unknown", QualityId: 4 })
    ).toThrow()
    expect(() =>
      toEchoSummary({ Id: 1, Name: "Unknown", Rarity: 99 })
    ).toThrow()
    expect(() =>
      toWeaponSummary({ Id: 1, Name: "Unknown", QualityId: 4, Type: 99 })
    ).toThrow()
  })
})
