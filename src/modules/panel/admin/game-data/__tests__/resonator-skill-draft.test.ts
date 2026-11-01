import { describe, expect, test } from "bun:test"
import type { EncoreSkill } from "@/modules/encore/domain/character"
import type { ResonatorSkillRow } from "@/db/schema"
import {
  resonatorSkillDraftFromEncore,
  resonatorSkillDraftFromRow,
} from "@/modules/panel/admin/game-data/views/resonators/detail/application/resonator-skill-draft"

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

describe("resonatorSkillDraftFromEncore", () => {
  test("maps the Encore skill to the form values", () => {
    expect(resonatorSkillDraftFromEncore(encoreSkill, 1311, 3)).toEqual({
      id: 0,
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
