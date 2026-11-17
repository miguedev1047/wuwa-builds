import { describe, expect, test } from "bun:test"
import { resonatorBestSetsInput } from "@catalog/application/schemas"

describe("resonatorBestSetsInput", () => {
  test("accepts an ordered list of distinct positive Sonata set ids", () => {
    expect(
      resonatorBestSetsInput.safeParse({
        resonatorId: 1409,
        sets: [{ setId: 1 }, { setId: 2 }],
      }).success
    ).toBe(true)
  })

  test("allows an empty list to clear the ranking", () => {
    expect(
      resonatorBestSetsInput.safeParse({ resonatorId: 1409, sets: [] }).success
    ).toBe(true)
  })

  test("rejects duplicate, invalid and excessive set ids", () => {
    expect(
      resonatorBestSetsInput.safeParse({
        resonatorId: 1409,
        sets: [{ setId: 1 }, { setId: 1 }],
      }).success
    ).toBe(false)
    expect(
      resonatorBestSetsInput.safeParse({
        resonatorId: 1409,
        sets: [{ setId: 0 }],
      }).success
    ).toBe(false)
    expect(
      resonatorBestSetsInput.safeParse({
        resonatorId: 1409,
        sets: Array.from({ length: 11 }, (_, index) => ({
          setId: index + 1,
        })),
      }).success
    ).toBe(false)
  })
})
