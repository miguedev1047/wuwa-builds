/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  buildPassive,
  buildRecord,
  characterDetail,
  echoDetail,
  echoSkillBonus,
  echoSlot,
  echoSummary,
  resonatorProperty,
  sonataEffect,
  sonataEntry,
  weaponDetail,
  weaponProperty,
  weaponRefinement,
} from "./catalog-fixtures"
import { resolveBuildCalculation } from "./resolve-build-calculation"

const resonator = characterDetail({
  properties: [
    resonatorProperty({
      name: "hp",
      baseValue: 816,
      values: [{ level: 1, value: 816 }],
    }),
    resonatorProperty({
      name: "atk",
      baseValue: 32,
      values: [{ level: 1, value: 32 }],
    }),
    resonatorProperty({
      name: "def",
      baseValue: 40,
      values: [{ level: 1, value: 40 }],
    }),
    resonatorProperty({
      name: "crit_rate",
      baseValue: 5,
      values: [{ level: 1, value: "5%" }],
    }),
    resonatorProperty({
      name: "crit_dmg",
      baseValue: 150,
      values: [{ level: 1, value: "150%" }],
    }),
  ],
})

const weapon = weaponDetail({
  properties: [
    weaponProperty({
      name: "atk",
      baseValue: 100,
      values: [{ level: 90, value: "500" }],
    }),
    weaponProperty({
      name: "crit_rate",
      baseValue: 5,
      values: [{ level: 90, value: "24.3%" }],
    }),
  ],
  refinements: [
    weaponRefinement({
      rank: 1,
      stats: [{ statName: "atk_percent", statNumber: 12 }],
    }),
  ],
})

const echoes = [
  echoSlot({
    index: 0,
    data: echoSummary({ id: 1, name: "Eco Uno" }),
    echoSetId: 1,
    mainStatStat: "atk_percent",
    mainStatLabel: "Ataque %",
    mainStatValue: 33,
    substats: [
      {
        index: 0,
        valueStat: "crit_dmg",
        valueLabel: "Daño Crítico",
        valueNumber: 12.6,
      },
    ],
  }),
  echoSlot({
    index: 1,
    data: echoSummary({ id: 2, name: "Eco Dos" }),
    echoSetId: 1,
  }),
]

const sonatas = [
  sonataEntry({
    id: 1,
    name: "Set Aero",
    effects: [sonataEffect({ pieces: 2, statId: "atk_percent", value: 10 })],
  }),
]

const echoDetails = [
  echoDetail({
    id: 1,
    name: "Eco Uno",
    skillBonuses: [echoSkillBonus({ statId: "crit_rate", value: 8 })],
  }),
  echoDetail({
    id: 2,
    name: "Eco Dos",
    skillBonuses: [
      echoSkillBonus({
        statId: "crit_dmg",
        value: 20,
        requiresMainSlot: true,
      }),
    ],
  }),
]

const build = buildRecord({
  resonator: {
    level: 1,
    sequency: 0,
    data: resonator,
    skills: [],
    passives: [],
  },
  weapon: { level: 90, refinament: 1, data: weapon },
  echoes,
  mainEchoSlot: 1,
})

describe("resolveBuildCalculation", () => {
  test("returns null without a resonator", () => {
    expect(
      resolveBuildCalculation({
        build: buildRecord(),
        resonator: null,
        weapon: null,
        echoDetails: [],
        sonatas: [],
      })
    ).toBeNull()
  })

  test("combines resonator, weapon, echoes, sonata and echo skill bonuses", () => {
    const result = resolveBuildCalculation({
      build,
      resonator,
      weapon,
      echoDetails,
      sonatas,
    })

    expect(result).not.toBeNull()

    expect(result!.stats.hp).toBe(816)
    expect(result!.stats.def).toBe(40)
    expect(result!.stats.atk).toBeCloseTo(1123, 5)
    expect(result!.stats.critRate).toBeCloseTo(37.3, 5)
    expect(result!.stats.critDmg).toBeCloseTo(182.6, 5)
    expect(result!.stats.energyRegen).toBe(100)
    expect(result!.diagnostics).toEqual([])
  })

  test("adds the stat passives of the resonator", () => {
    const result = resolveBuildCalculation({
      build: {
        ...build,
        resonator: {
          ...build.resonator,
          passives: [
            buildPassive({ name: "PS+", value: 10 }),
            buildPassive({ name: "Prob. CRIT+", value: 5 }),
          ],
        },
        echoes: [],
      },
      resonator,
      weapon: null,
      echoDetails: [],
      sonatas: [],
    })

    expect(result!.stats.hp).toBeCloseTo(897, 5)
    expect(result!.stats.critRate).toBe(10)
  })

  test("adds energy regen bonuses to the 100% base", () => {
    const result = resolveBuildCalculation({
      build: {
        ...build,
        echoes: [
          echoSlot({
            data: echoSummary(),
            mainStatStat: "energy_regen",
            mainStatValue: 18.4,
          }),
        ],
        mainEchoSlot: null,
      },
      resonator,
      weapon: null,
      echoDetails: [],
      sonatas: [],
    })

    expect(result!.stats.energyRegen).toBe(118.4)
  })

  test("golden: Cartethyia level 90 base and passives", () => {
    const cartethyia = characterDetail({
      properties: [
        resonatorProperty({
          name: "hp",
          baseValue: 1184,
          values: [{ level: 90, value: 14800 }],
        }),
        resonatorProperty({
          name: "atk",
          baseValue: 25,
          values: [{ level: 90, value: 312.5 }],
        }),
        resonatorProperty({
          name: "def",
          baseValue: 50,
          values: [{ level: 90, value: 611.11 }],
        }),
        resonatorProperty({
          name: "crit_rate",
          baseValue: 5,
          values: [{ level: 90, value: "5%" }],
        }),
        resonatorProperty({
          name: "crit_dmg",
          baseValue: 150,
          values: [{ level: 90, value: "150%" }],
        }),
      ],
    })
    const passives = [
      buildPassive({ name: "Prob. CRIT+", value: 1.2 }),
      buildPassive({ name: "PS+", value: 1.8 }),
      buildPassive({ name: "PS+", value: 1.8 }),
      buildPassive({ name: "Prob. CRIT+", value: 1.2 }),
      buildPassive({ name: "Prob. CRIT+", value: 2.8 }),
      buildPassive({ name: "PS+", value: 4.2 }),
      buildPassive({ name: "PS+", value: 4.2 }),
      buildPassive({ name: "Prob. CRIT+", value: 2.8 }),
    ]
    const build = buildRecord({
      resonator: {
        level: 90,
        sequency: 0,
        data: cartethyia,
        skills: [],
        passives,
      },
      weapon: { level: 90, refinament: 1, data: null },
      echoes: [],
      mainEchoSlot: null,
    })

    const result = resolveBuildCalculation({
      build,
      resonator: cartethyia,
      weapon: null,
      echoDetails: [],
      sonatas: [],
    })

    expect(result!.stats.hp).toBeCloseTo(16574, 5)
    expect(result!.stats.atk).toBe(312)
    expect(result!.stats.def).toBe(611)
    expect(result!.stats.critRate).toBe(13)
    expect(result!.stats.critDmg).toBe(150)
    expect(result!.stats.energyRegen).toBe(100)
    expect(result!.trace.base).toEqual({
      hp: 14800,
      atk: 312.5,
      def: 611.11,
      critRate: 5,
      critDmg: 150,
      energyRegen: 100,
    })
    expect(result!.trace.effectiveBase).toEqual({
      hp: 14800,
      atk: 312,
      def: 611,
      critRate: 5,
      critDmg: 150,
      energyRegen: 100,
    })
    expect(result!.trace.contributions).toHaveLength(8)
    expect(
      result!.trace.contributions.every((contribution) => contribution.applied)
    ).toBe(true)
  })

  test("turns a main-slot bonus into a conditional effect without mainEchoSlot", () => {
    const result = resolveBuildCalculation({
      build: { ...build, mainEchoSlot: null },
      resonator,
      weapon,
      echoDetails,
      sonatas,
    })

    expect(result!.stats.critDmg).toBeCloseTo(162.6, 5)
    expect(result!.conditionalEffects).toEqual([
      {
        source: "Eco Dos",
        description: "Requiere eco principal: Daño Crit. +20%",
      },
    ])
  })

  test("calculates the resonator base without a weapon", () => {
    const result = resolveBuildCalculation({
      build: { ...build, weapon: { ...build.weapon, data: null }, echoes: [] },
      resonator,
      weapon: null,
      echoDetails: [],
      sonatas: [],
    })

    expect(result!.stats.atk).toBe(32)
    expect(result!.stats.critRate).toBe(5)
  })

  test("reports an unknown resonator element", () => {
    const unknown = { ...resonator, element: "Mystery" }
    const result = resolveBuildCalculation({
      build: {
        ...build,
        resonator: { ...build.resonator, data: unknown },
        echoes: [],
      },
      resonator: unknown,
      weapon: null,
      echoDetails: [],
      sonatas: [],
    })

    expect(result!.diagnostics).toEqual(["Unknown resonator element: Mystery"])
  })

  test("reports unmapped echo stats through the calculation result", () => {
    const result = resolveBuildCalculation({
      build: {
        ...build,
        echoes: [
          echoSlot({
            data: echoSummary(),
            mainStatStat: "echo_skill_bonus",
            mainStatValue: 10,
          }),
        ],
      },
      resonator,
      weapon: null,
      echoDetails: [],
      sonatas: [],
    })

    expect(result!.diagnostics).toEqual([
      "echo_skill_bonus is not part of CharacterStats",
    ])
    expect(result!.unmappedBonuses).toEqual([
      { statId: "echo_skill_bonus", value: 10, source: "Eco 1 main" },
    ])
  })
})
