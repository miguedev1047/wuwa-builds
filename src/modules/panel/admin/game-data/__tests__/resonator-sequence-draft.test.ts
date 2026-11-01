import { describe, expect, test } from "bun:test"
import type { ResonatorSequenceRow } from "@/db/schema"
import type { EncoreSequence } from "@/modules/encore/domain/character"
import {
  resonatorSequenceDraftFromRow,
  resonatorSequencePayloads,
} from "@/modules/panel/admin/game-data/views/resonators/detail/application/resonator-sequence-draft"

const sequenceRow: ResonatorSequenceRow = {
  id: 3,
  resonatorId: 1311,
  sequenceId: 355,
  sortOrder: 1,
  index: 1,
  name: "Bote, rompe la marea creciente",
  description: "<p>Descripcion</p>",
  createdAt: new Date(0),
  updatedAt: new Date(0),
}

const encoreSequences: EncoreSequence[] = [
  { id: 355, index: 1, name: "A", description: "d1" },
  { id: 356, index: 2, name: "B", description: "d2" },
  { id: 357, index: 3, name: "C", description: "d3" },
]

describe("resonatorSequenceDraftFromRow", () => {
  test("maps the row to the edit form values", () => {
    expect(resonatorSequenceDraftFromRow(sequenceRow)).toEqual({
      id: 3,
      resonatorId: 1311,
      sequenceId: 355,
      sortOrder: 1,
      index: 1,
      name: "Bote, rompe la marea creciente",
      description: "<p>Descripcion</p>",
    })
  })
})

describe("resonatorSequencePayloads", () => {
  test("expands the selected sequences in Encore order", () => {
    expect(
      resonatorSequencePayloads(["357", "355"], encoreSequences, 1311, 4)
    ).toEqual([
      {
        resonatorId: 1311,
        sequenceId: 355,
        sortOrder: 4,
        index: 1,
        name: "A",
        description: "d1",
      },
      {
        resonatorId: 1311,
        sequenceId: 357,
        sortOrder: 5,
        index: 3,
        name: "C",
        description: "d3",
      },
    ])
  })

  test("returns nothing when no sequence is selected", () => {
    expect(resonatorSequencePayloads([], encoreSequences, 1311, 1)).toEqual([])
  })
})
