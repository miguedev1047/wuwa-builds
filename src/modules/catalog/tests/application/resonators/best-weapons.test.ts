import { describe, expect, test } from "bun:test"
import { resonatorBestWeaponsInput } from "@catalog/application/schemas"

describe("resonatorBestWeaponsInput", () => {
  test("accepts an ordered list of distinct positive weapon ids", () => {
    expect(
      resonatorBestWeaponsInput.safeParse({
        resonatorId: 1409,
        weapons: [{ weaponId: 21050016 }, { weaponId: 21050017 }],
      }).success
    ).toBe(true)
  })

  test("allows an empty list to clear the ranking", () => {
    expect(
      resonatorBestWeaponsInput.safeParse({
        resonatorId: 1409,
        weapons: [],
      }).success
    ).toBe(true)
  })

  test("rejects duplicate, invalid and excessive weapon ids", () => {
    expect(
      resonatorBestWeaponsInput.safeParse({
        resonatorId: 1409,
        weapons: [{ weaponId: 21050016 }, { weaponId: 21050016 }],
      }).success
    ).toBe(false)
    expect(
      resonatorBestWeaponsInput.safeParse({
        resonatorId: 1409,
        weapons: [{ weaponId: 0 }],
      }).success
    ).toBe(false)
    expect(
      resonatorBestWeaponsInput.safeParse({
        resonatorId: 1409,
        weapons: Array.from({ length: 11 }, (_, index) => ({
          weaponId: index + 1,
        })),
      }).success
    ).toBe(false)
  })
})
