/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { EncoreCharacterDetail } from "@/modules/encore/domain/character"
import { resonatorDraftFromEncore } from "./resonator-draft"

const character: EncoreCharacterDetail = {
  id: 1402,
  name: "Yangyang",
  nickname: "Brisa",
  introduction: "Resonadora de Jinzhou",
  rarity: 4,
  element: "Aero",
  weaponType: "Espada",
  icon: "https://api.encore.moe/resource/Data/icon.webp",
  images: {
    card: "https://api.encore.moe/resource/Data/card.webp",
    icon: "",
    iconLarge: "https://api.encore.moe/resource/Data/icon-large.webp",
    circle: "https://api.encore.moe/resource/Data/circle.webp",
    portrait: "https://api.encore.moe/resource/Data/portrait.webp",
  },
  tags: [],
  properties: [],
  skills: [],
  sequences: [],
  passives: [],
  breaches: [],
}

describe("resonatorDraftFromEncore", () => {
  test("maps the detail fields the form needs", () => {
    expect(resonatorDraftFromEncore(character)).toEqual({
      id: 1402,
      name: "Yangyang",
      nickname: "Brisa",
      introduction: "Resonadora de Jinzhou",
      rarity: 4,
      element: "Aero",
      weaponType: "Espada",
      icon: "https://api.encore.moe/resource/Data/icon.webp",
      card: "https://api.encore.moe/resource/Data/card.webp",
      circle: "https://api.encore.moe/resource/Data/circle.webp",
      portrait: "https://api.encore.moe/resource/Data/portrait.webp",
      iconLarge: "https://api.encore.moe/resource/Data/icon-large.webp",
    })
  })

  test("falls back to the image icon when the main one is empty", () => {
    const draft = resonatorDraftFromEncore({
      ...character,
      icon: "",
      images: { ...character.images, icon: "https://example.com/icon.webp" },
    })

    expect(draft.icon).toBe("https://example.com/icon.webp")
  })
})
