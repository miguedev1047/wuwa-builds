/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  echoSlot,
  sonataEffect,
  sonataEntry,
} from "@builds/application/calculation/catalog-fixtures"
import { resolveSonataBonuses } from "@builds/application/calculation/sonata"

describe("resolveSonataBonuses", () => {
  test("counts equipped echoes and applies reached static thresholds", () => {
    const result = resolveSonataBonuses(
      [
        echoSlot({ index: 0, echoSetId: 1 }),
        echoSlot({ index: 1, echoSetId: 1 }),
        echoSlot({ index: 2, echoSetId: 1 }),
        echoSlot({ index: 3, echoSetId: 2 }),
        echoSlot({ index: 4, data: null, echoSetId: 1 }),
      ],
      [
        sonataEntry({
          id: 1,
          name: "Set Aero",
          effects: [
            sonataEffect({ pieces: 2, statId: "atk_percent", value: 10 }),
            sonataEffect({
              pieces: 3,
              isConditional: true,
              statId: null,
              value: null,
              description: "Solo en combate",
            }),
            sonataEffect({ pieces: 5, statId: "aero_dmg", value: 15 }),
          ],
        }),
        sonataEntry({
          id: 2,
          name: "Set Dos",
          effects: [
            sonataEffect({ pieces: 1, statId: "hp_percent", value: 12 }),
            sonataEffect({ pieces: 2, statId: "crit_rate", value: 8 }),
          ],
        }),
      ]
    )

    expect(result.bonuses).toEqual([
      { statId: "atk_percent", value: 10, source: "Set Aero" },
      { statId: "hp_percent", value: 12, source: "Set Dos" },
    ])
    expect(result.conditionalEffects).toEqual([
      { source: "Set Aero", description: "Solo en combate" },
    ])
    expect(result.diagnostics).toEqual([])
  })

  test("does not apply a threshold above the equipped count", () => {
    const result = resolveSonataBonuses(
      [echoSlot({ echoSetId: 1 })],
      [
        sonataEntry({
          id: 1,
          effects: [
            sonataEffect({ pieces: 2, statId: "atk_percent", value: 10 }),
          ],
        }),
      ]
    )

    expect(result.bonuses).toEqual([])
  })

  test("reports a set missing from the catalog", () => {
    const result = resolveSonataBonuses([echoSlot({ echoSetId: 99 })], [])

    expect(result.diagnostics).toEqual(["Sonata 99 not found"])
  })

  test("reports a static effect without stat or value", () => {
    const result = resolveSonataBonuses(
      [echoSlot({ echoSetId: 1 })],
      [
        sonataEntry({
          id: 1,
          name: "Set Roto",
          effects: [
            sonataEffect({
              pieces: 1,
              isConditional: false,
              statId: null,
              value: null,
            }),
          ],
        }),
      ]
    )

    expect(result.bonuses).toEqual([])
    expect(result.diagnostics).toEqual(["Sonata Set Roto effect has no stat"])
  })

  test("ignores slots without an echo or a selected set", () => {
    const result = resolveSonataBonuses(
      [echoSlot({ echoSetId: null }), echoSlot({ data: null, echoSetId: 1 })],
      [
        sonataEntry({
          id: 1,
          effects: [
            sonataEffect({ pieces: 1, statId: "atk_percent", value: 10 }),
          ],
        }),
      ]
    )

    expect(result.bonuses).toEqual([])
    expect(result.diagnostics).toEqual([])
  })
})
