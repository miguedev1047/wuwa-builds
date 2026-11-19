/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { WeaponRefinementRow, WeaponRefinementStatRow } from "@db/schema"
import type { EncoreWeaponRefinement } from "@encore/domain/weapon"
import {
  weaponRefinementDraftFromEncore,
  weaponRefinementDraftFromRow,
  weaponRefinementOptions,
  weaponRefinementPayloads,
  weaponStatDraftFromRow,
  weaponStatPayloads,
} from "@catalog/presentation/weapons/detail/application/weapon-refinement-draft"

const encoreRefinement: EncoreWeaponRefinement = {
  rank: 3,
  name: "Amplificación eléctrica",
  effect: "Aumenta el ATQ un <span>18%</span>.",
  stats: [],
}

const refinementRow: WeaponRefinementRow = {
  id: 9,
  weaponId: 21050016,
  sortOrder: 3,
  name: "Amplificación eléctrica",
  effect: "Aumenta el ATQ un <span>18%</span>.",
  createdAt: new Date(),
  updatedAt: new Date(),
}

const statRow: WeaponRefinementStatRow = {
  id: 12,
  refinementId: 9,
  sortOrder: 1,
  statName: "atk_percent",
  statNumber: 18,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe("weaponRefinementDraftFromEncore", () => {
  test("maps the rank, name and expanded effect", () => {
    expect(weaponRefinementDraftFromEncore(encoreRefinement)).toEqual({
      sortOrder: 3,
      name: "Amplificación eléctrica",
      effect: "Aumenta el ATQ un <span>18%</span>.",
    })
  })
})

describe("weaponRefinementDraftFromRow", () => {
  test("maps a saved refinement to the edit form values", () => {
    expect(weaponRefinementDraftFromRow(refinementRow)).toEqual({
      id: 9,
      weaponId: 21050016,
      sortOrder: 3,
      name: "Amplificación eléctrica",
      effect: "Aumenta el ATQ un <span>18%</span>.",
    })
  })
})

describe("weaponStatDraftFromRow", () => {
  test("maps the stored name and number to the form row", () => {
    expect(weaponStatDraftFromRow(statRow)).toEqual({
      statName: "atk_percent",
      value: 18,
    })
  })
})

describe("weaponStatPayloads", () => {
  test("adds consecutive sort orders for every stat row", () => {
    expect(
      weaponStatPayloads({
        refinementId: 9,
        sortOrder: 4,
        stats: [
          { statName: "atk_percent", value: 18 },
          { statName: "echo_skill_bonus", value: 20 },
        ],
      })
    ).toEqual([
      {
        refinementId: 9,
        sortOrder: 4,
        statName: "atk_percent",
        statNumber: 18,
      },
      {
        refinementId: 9,
        sortOrder: 5,
        statName: "echo_skill_bonus",
        statNumber: 20,
      },
    ])
  })
})

describe("weaponRefinementOptions", () => {
  const refinements: EncoreWeaponRefinement[] = [
    encoreRefinement,
    { ...encoreRefinement, rank: 1, name: "Otra", effect: "Otro efecto." },
  ]

  test("offers only the rounds the weapon does not have yet", () => {
    const options = weaponRefinementOptions(refinements, [3])

    expect(options).toHaveLength(1)
    expect(options[0].value).toBe("1")
    expect(options[0].draft.name).toBe("Otra")
  })
})

describe("weaponRefinementPayloads", () => {
  const refinements: EncoreWeaponRefinement[] = [
    encoreRefinement,
    { ...encoreRefinement, rank: 1, name: "Otra", effect: "Otro efecto." },
  ]

  test("sends one payload per selected round", () => {
    const options = weaponRefinementOptions(refinements, [])

    expect(
      weaponRefinementPayloads(
        {
          id: 0,
          weaponId: 9,
          sortOrder: 1,
          name: "",
          effect: "",
          encoreRefinements: ["3", "1"],
        },
        options
      )
    ).toEqual([
      {
        weaponId: 9,
        sortOrder: 3,
        name: "Amplificación eléctrica",
        effect: "Aumenta el ATQ un <span>18%</span>.",
      },
      { weaponId: 9, sortOrder: 1, name: "Otra", effect: "Otro efecto." },
    ])
  })

  test("falls back to the manual entry", () => {
    expect(
      weaponRefinementPayloads(
        {
          id: 0,
          weaponId: 9,
          sortOrder: 5,
          name: "Manual",
          effect: "Efecto manual.",
          encoreRefinements: [],
        },
        []
      )
    ).toEqual([
      {
        weaponId: 9,
        sortOrder: 5,
        name: "Manual",
        effect: "Efecto manual.",
      },
    ])
  })
})
