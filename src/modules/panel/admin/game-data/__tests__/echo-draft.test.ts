/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { EchoRow } from "@db/schema"
import type { EncoreEchoDetail } from "@encore/domain/echo"
import {
  echoDraftFromEncore,
  echoDraftFromRow,
} from "@panel/admin/game-data/views/echoes/shared/application/echo-draft"

const echo: EncoreEchoDetail = {
  id: 390080005,
  name: "Geochelone Portacampana",
  class: 3,
  cost: 4,
  icon: "https://api-v2.encore.moe/resource/Data/icon.webp",
  sets: [],
  skill: null,
}

describe("echoDraftFromEncore", () => {
  test("maps the detail fields the create form needs", () => {
    expect(echoDraftFromEncore(echo)).toEqual({
      id: 390080005,
      name: "Geochelone Portacampana",
      class: 3,
      cost: 4,
      icon: "https://api-v2.encore.moe/resource/Data/icon.webp",
    })
  })

  test("does not leak sets or the skill into the payload", () => {
    const draft = echoDraftFromEncore(echo)

    expect(draft).not.toHaveProperty("sets")
    expect(draft).not.toHaveProperty("skill")
  })

  test("does not carry a star rating into the catalog row", () => {
    expect(echoDraftFromEncore(echo)).not.toHaveProperty("rarity")
  })
})

describe("echoDraftFromRow", () => {
  const row: EchoRow = {
    id: 390080005,
    name: "Geochelone Portacampana",
    class: 3,
    cost: 4,
    icon: "https://api-v2.encore.moe/resource/Data/icon.webp",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  test("maps a saved row to the edit form values", () => {
    expect(echoDraftFromRow(row)).toEqual({
      id: 390080005,
      name: "Geochelone Portacampana",
      class: 3,
      cost: 4,
      icon: "https://api-v2.encore.moe/resource/Data/icon.webp",
    })
  })

  test("does not leak the database timestamps", () => {
    const draft = echoDraftFromRow(row)

    expect(draft).not.toHaveProperty("createdAt")
    expect(draft).not.toHaveProperty("updatedAt")
  })
})
