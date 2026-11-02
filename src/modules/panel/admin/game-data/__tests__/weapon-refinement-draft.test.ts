/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { WeaponRefinementRow, WeaponRefinementStatRow } from "@/db/schema"
import type { EncoreWeaponRefinement } from "@/modules/encore/domain/weapon"
import {
  weaponRefinementDraftFromEncore,
  weaponRefinementDraftFromRow,
  weaponStatDraftFromRow,
  weaponStatPayloads,
} from "@/modules/panel/admin/game-data/views/weapons/detail/application/weapon-refinement-draft"

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
  statName: "Ataque %",
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
      statName: "Ataque %",
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
          { statName: "Ataque %", value: 18 },
          { statName: "Bono de Eco", value: 20 },
        ],
      })
    ).toEqual([
      {
        refinementId: 9,
        sortOrder: 4,
        statName: "Ataque %",
        statNumber: 18,
      },
      {
        refinementId: 9,
        sortOrder: 5,
        statName: "Bono de Eco",
        statNumber: 20,
      },
    ])
  })
})
