/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { SonataSetEffectRow, SonataSetRow } from "@db/schema"
import {
  parseSonataStat,
  sonataDraftFromRow,
  toSonataEffectDraft,
  toSonataInput,
} from "@game-data/application/echoes/sonatas"

describe("parseSonataStat", () => {
  test("maps every Encore alias to its canonical stat id", () => {
    expect(parseSonataStat("ATQ +10%")).toEqual({
      statId: "atk_percent",
      value: 10,
    })
    expect(parseSonataStat("PS +10%")).toEqual({
      statId: "hp_percent",
      value: 10,
    })
    expect(parseSonataStat("Daño Gelio +10%")).toEqual({
      statId: "glacio_dmg",
      value: 10,
    })
    expect(parseSonataStat("Regen. de energía +10%")).toEqual({
      statId: "energy_regen",
      value: 10,
    })
    expect(parseSonataStat("Bonif. de curación +10%")).toEqual({
      statId: "healing_bonus",
      value: 10,
    })
    expect(parseSonataStat("Daño de Habilidad de resonancia +10%")).toEqual({
      statId: "skill_bonus",
      value: 10,
    })
  })

  test("accepts a trailing period and decimals", () => {
    expect(parseSonataStat("Daño Aero +7.5%.")).toEqual({
      statId: "aero_dmg",
      value: 7.5,
    })
  })

  test("returns null for conditional prose, placeholders and unknown stats", () => {
    expect(
      parseSonataStat(
        "Cuando la Energía de resonancia del personaje es 0, su Prob. CRIT aumenta un 20%."
      )
    ).toBeNull()
    expect(parseSonataStat("Regen. de energía +{0}")).toBeNull()
    expect(parseSonataStat("Daño Mágico +10%")).toBeNull()
  })
})

describe("toSonataEffectDraft", () => {
  test("marks a parsed 2-piece bonus as static", () => {
    expect(
      toSonataEffectDraft({ pieces: 2, description: "Daño Aero +10%" })
    ).toEqual({
      pieces: 2,
      description: "Daño Aero +10%",
      isConditional: false,
      statId: "aero_dmg",
      value: 10,
    })
  })

  test("keeps 1, 3 and 5 piece bonuses conditional", () => {
    for (const pieces of [1, 3, 5]) {
      expect(
        toSonataEffectDraft({ pieces, description: "ATQ +10%" })
      ).toMatchObject({ isConditional: true, statId: null, value: null })
    }
  })

  test("keeps an unparsed 2-piece conditional instead of guessing", () => {
    expect(
      toSonataEffectDraft({ pieces: 2, description: "Algo raro" })
    ).toMatchObject({ isConditional: true, statId: null, value: null })
  })
})

describe("toSonataInput", () => {
  test("drops the empty second slot", () => {
    const input = toSonataInput({
      id: 1,
      name: "Escarcha helada",
      icon: "",
      color: "",
      effects: [
        {
          pieces: 2,
          description: "Daño Gelio +10%",
          isConditional: false,
          statId: "glacio_dmg",
          value: 10,
        },
        {
          pieces: 5,
          description: "   ",
          isConditional: true,
          statId: null,
          value: null,
        },
      ],
    })

    expect(input.effects).toHaveLength(1)
    expect(input.effects[0].pieces).toBe(2)
  })

  test("clears the stat of a conditional effect", () => {
    const input = toSonataInput({
      id: 32,
      name: "Sombra de sueños rotos",
      icon: "",
      color: "",
      effects: [
        {
          pieces: 1,
          description: "Al aplicar Hackeo: Transición...",
          isConditional: true,
          statId: "atk_percent",
          value: 35,
        },
        {
          pieces: 2,
          description: "",
          isConditional: false,
          statId: null,
          value: null,
        },
      ],
    })

    expect(input.effects[0].statId).toBeNull()
    expect(input.effects[0].value).toBeNull()
  })
})

describe("sonataDraftFromRow", () => {
  const row: SonataSetRow = {
    id: 1,
    name: "Escarcha helada",
    icon: "https://api-v2.encore.moe/resource/Data/icon.webp",
    color: "FFFFFF00",
    source: "encore",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const effect: SonataSetEffectRow = {
    id: 10,
    setId: 1,
    pieces: 2,
    description: "Daño Gelio +10%",
    isConditional: false,
    statId: "glacio_dmg",
    value: 10,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  test("maps a saved set to the two form slots", () => {
    const draft = sonataDraftFromRow({ ...row, effects: [effect] })

    expect(draft.effects[0]).toMatchObject({
      pieces: 2,
      statId: "glacio_dmg",
      value: 10,
    })
    expect(draft.effects[1]).toMatchObject({
      pieces: 5,
      description: "",
      isConditional: true,
    })
  })

  test("drops a stat id that is not in the canonical vocabulary", () => {
    const draft = sonataDraftFromRow({
      ...row,
      effects: [{ ...effect, statId: "made_up" }],
    })

    expect(draft.effects[0].statId).toBeNull()
  })
})
