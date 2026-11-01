import { describe, expect, test } from "bun:test"
import type { ResonatorPassiveRow } from "@/db/schema"
import type { EncorePassive } from "@/modules/encore/domain/character"
import {
  resonatorPassiveDraftFromRow,
  resonatorPassivePayloads,
} from "@/modules/panel/admin/game-data/views/resonators/detail/application/resonator-passive-draft"

const passiveRow: ResonatorPassiveRow = {
  id: 4,
  resonatorId: 1311,
  passiveId: 155,
  sortOrder: 1,
  title: "ATQ+",
  description: "<p>Descripcion</p>",
  icon: "passive.webp",
  createdAt: new Date(0),
  updatedAt: new Date(0),
}

const encorePassives: EncorePassive[] = [
  { id: 155, title: "A", description: "d1", icon: "i1", consume: [] },
  {
    id: 156,
    title: "B",
    description: "d2",
    icon: "i2",
    consume: [{ key: 1, value: 2, icon: "item.webp", quality: 1 }],
  },
]

describe("resonatorPassiveDraftFromRow", () => {
  test("maps the row to the edit form values", () => {
    expect(resonatorPassiveDraftFromRow(passiveRow)).toEqual({
      id: 4,
      resonatorId: 1311,
      passiveId: 155,
      sortOrder: 1,
      title: "ATQ+",
      description: "<p>Descripcion</p>",
      icon: "passive.webp",
    })
  })
})

describe("resonatorPassivePayloads", () => {
  test("expands the selected passives in Encore order", () => {
    expect(
      resonatorPassivePayloads(["156", "155"], encorePassives, 1311, 3)
    ).toEqual([
      {
        resonatorId: 1311,
        passiveId: 155,
        sortOrder: 3,
        title: "A",
        description: "d1",
        icon: "i1",
      },
      {
        resonatorId: 1311,
        passiveId: 156,
        sortOrder: 4,
        title: "B",
        description: "d2",
        icon: "i2",
      },
    ])
  })

  test("returns nothing when no passive is selected", () => {
    expect(resonatorPassivePayloads([], encorePassives, 1311, 1)).toEqual([])
  })
})
