/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { EncoreWeaponDetail } from "@/modules/encore/domain/weapon"
import { weaponDraftFromEncore } from "@/modules/panel/admin/game-data/views/weapons/new/application/weapon-draft"

const weapon: EncoreWeaponDetail = {
  id: 21050016,
  name: "Maestro de cuerdas",
  rarity: 5,
  type: 5,
  typeName: "Rectificador",
  icon: "https://api-v2.encore.moe/resource/Data/icon.webp",
  description: "El palmo de la marioneta se abre.",
  properties: [
    {
      name: "ATQ",
      icon: "https://api-v2.encore.moe/resource/Data/atk.webp",
      baseValue: 40,
      growth: [{ level: 1, value: "40.00" }],
    },
  ],
  refinements: [
    { rank: 1, name: "Amplificación eléctrica", effect: "Efecto", stats: [] },
  ],
}

describe("weaponDraftFromEncore", () => {
  test("maps the detail fields the create form needs", () => {
    expect(weaponDraftFromEncore(weapon)).toEqual({
      id: 21050016,
      name: "Maestro de cuerdas",
      rarity: 5,
      type: 5,
      icon: "https://api-v2.encore.moe/resource/Data/icon.webp",
      description: "El palmo de la marioneta se abre.",
    })
  })

  test("does not leak refinements, properties or type names into the payload", () => {
    const draft = weaponDraftFromEncore(weapon)

    expect(draft).not.toHaveProperty("refinements")
    expect(draft).not.toHaveProperty("properties")
    expect(draft).not.toHaveProperty("typeName")
  })
})
