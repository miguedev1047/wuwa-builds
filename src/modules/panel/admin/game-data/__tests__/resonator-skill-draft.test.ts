import { describe, expect, test } from "bun:test"
import type { EncoreSkill } from "@encore/domain/character"
import type { ResonatorSkillRow } from "@db/schema"
import {
  resonatorSkillDraftFromRow,
  resonatorSkillPayloads,
} from "@panel/admin/game-data/views/resonators/detail/application/resonator-skill-draft"

const encoreSkill: EncoreSkill = {
  id: 1006102,
  type: "Habilidad de resonancia",
  name: "Al corazon bajo la luna",
  description: "<span>Descripcion</span>",
  icon: "icon.webp",
  media: "skill.mp4",
  attributes: [{ id: 1, name: "Nv.1", values: ["10%"] }],
  consumes: [],
  damage: [],
}

const secondEncoreSkill: EncoreSkill = {
  id: 1006103,
  type: "Liberacion de resonancia",
  name: "Nexo iluminado",
  description: "<span>Otra descripcion</span>",
  icon: "icon2.webp",
  media: "skill2.mp4",
  attributes: [],
  consumes: [],
  damage: [],
}

const skillRow: ResonatorSkillRow = {
  id: 7,
  resonatorId: 1311,
  skillId: 1006102,
  sortOrder: 3,
  type: "Habilidad de resonancia",
  name: "Al corazon bajo la luna",
  description: "<span>Descripcion</span>",
  icon: "icon.webp",
  media: "skill.mp4",
  createdAt: new Date(0),
  updatedAt: new Date(0),
}

describe("resonatorSkillPayloads", () => {
  test("expands the selected skills in Encore order", () => {
    expect(
      resonatorSkillPayloads(
        ["1006103", "1006102"],
        [encoreSkill, secondEncoreSkill],
        1311,
        3
      )
    ).toEqual([
      {
        resonatorId: 1311,
        skillId: 1006102,
        sortOrder: 3,
        type: "Habilidad de resonancia",
        name: "Al corazon bajo la luna",
        description: "<span>Descripcion</span>",
        icon: "icon.webp",
        media: "skill.mp4",
      },
      {
        resonatorId: 1311,
        skillId: 1006103,
        sortOrder: 4,
        type: "Liberacion de resonancia",
        name: "Nexo iluminado",
        description: "<span>Otra descripcion</span>",
        icon: "icon2.webp",
        media: "skill2.mp4",
      },
    ])
  })

  test("returns nothing when no skill is selected", () => {
    expect(
      resonatorSkillPayloads([], [encoreSkill, secondEncoreSkill], 1311, 1)
    ).toEqual([])
  })
})

describe("resonatorSkillDraftFromRow", () => {
  test("keeps the row id for the edit form", () => {
    expect(resonatorSkillDraftFromRow(skillRow)).toEqual({
      id: 7,
      resonatorId: 1311,
      skillId: 1006102,
      sortOrder: 3,
      type: "Habilidad de resonancia",
      name: "Al corazon bajo la luna",
      description: "<span>Descripcion</span>",
      icon: "icon.webp",
      media: "skill.mp4",
    })
  })
})
