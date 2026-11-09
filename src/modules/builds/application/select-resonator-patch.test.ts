/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { characterDetail } from "./calculation/catalog-fixtures"
import { createEmptyResonator } from "./factories/build"
import { selectResonatorPatch } from "./select-resonator-patch"

const first = characterDetail({ id: 1, name: "Cartethyia" })
const second = characterDetail({
  id: 2,
  name: "Hsin",
  weaponType: "broadblade",
})

describe("selectResonatorPatch", () => {
  test("seeds the resonator and keeps the weapon on the first pick", () => {
    const patch = selectResonatorPatch({
      current: createEmptyResonator(),
      character: first,
      detail: first,
    })

    expect(patch?.resonator.data).toBe(first)
    expect(patch?.weapon).toBeUndefined()
  })

  test("returns null when the resonator is already selected", () => {
    const patch = selectResonatorPatch({
      current: {
        ...createEmptyResonator(),
        data: first,
      },
      character: first,
      detail: first,
    })

    expect(patch).toBeNull()
  })

  test("resets the weapon when the resonator is replaced", () => {
    const patch = selectResonatorPatch({
      current: {
        ...createEmptyResonator(),
        data: first,
      },
      character: second,
      detail: second,
    })

    expect(patch?.resonator.data).toBe(second)
    expect(patch?.weapon).toEqual({
      data: null,
      level: 90,
      refinament: 1,
    })
  })
})
