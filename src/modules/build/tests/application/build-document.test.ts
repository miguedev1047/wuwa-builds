/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  buildToPayload,
  payloadToBuild,
} from "@build/application/build-document"
import type { BuildRecord } from "@build/application/ports/build-repository"
import { BUILD_DOCUMENT_VERSION } from "@build/domain/build"
import type { BuildPayload } from "@build/domain/build"
import type { BuildProps } from "@build/domain/build-record"
import {
  characterDetail,
  echoSlot,
  echoSummary,
  weaponDetail,
} from "@build/tests/fixtures/catalog-fixtures"
import type { CharacterDetail } from "@catalog/domain/character"
import type { ResonatorPassiveRow, ResonatorSkillRow } from "@db/schema"

const dates = { createdAt: new Date(0), updatedAt: new Date(0) }

const skill: CharacterDetail["skills"][number] = {
  id: 11,
  resonatorId: 5,
  skillId: 1,
  sortOrder: 0,
  type: "normal",
  name: "Ataque",
  description: "",
  icon: "",
  media: "",
  ...dates,
} satisfies ResonatorSkillRow

const passive: ResonatorPassiveRow = {
  id: 1,
  resonatorId: 5,
  passiveId: 101,
  sortOrder: 0,
  title: "Pasiva",
  valueNumber: 10,
  icon: "",
  ...dates,
}

const character = characterDetail({ id: 5, name: "Cartethyia" })
const detail = characterDetail({
  id: 5,
  name: "Cartethyia",
  skills: [skill],
  passives: [passive],
})
const weapon = { ...weaponDetail(), id: 55 }
const echo = echoSummary({ id: 900, cost: 4 })

const payload: BuildPayload = {
  resonator: {
    level: 80,
    sequenceRank: 2,
    skillLevels: [{ skillId: 1, level: 6 }],
    passives: [{ passiveId: 101, enabled: false }],
  },
  weapon: { weaponId: 55, level: 70, refinementRank: 3 },
  echoLoadout: [
    {
      echoId: 900,
      level: 25,
      mainStatId: "atk_percent",
      sonataId: null,
      substats: [{ statId: "crit_rate", value: 6.3 }],
    },
    { echoId: null, level: 0, mainStatId: null, sonataId: null, substats: [] },
    { echoId: null, level: 0, mainStatId: null, sonataId: null, substats: [] },
    { echoId: null, level: 0, mainStatId: null, sonataId: null, substats: [] },
    { echoId: null, level: 0, mainStatId: null, sonataId: null, substats: [] },
  ],
  mainEchoSlot: 0,
  backgroundIndex: 2,
  notes: "",
}

const build: BuildProps = {
  buildId: "build-1",
  userId: "user-1",
  backgroundIndex: 2,
  name: "Mi build",
  resonator: {
    level: 80,
    sequency: 2,
    data: character,
    skills: [{ id: 11, skillId: 1, level: 6 }],
    passives: [
      {
        id: 1,
        passiveId: 101,
        name: "Pasiva",
        value: 10,
        icon: "",
        type: "passive",
        enabled: false,
      },
    ],
  },
  weapon: { level: 70, refinament: 3, data: weapon },
  echoes: [
    echoSlot({
      data: echo,
      index: 0,
      mainStatStat: "atk_percent",
      mainStatLabel: "Ataque %",
      mainStatValue: 33,
      cost: 4,
      substats: [
        {
          index: 0,
          valueStat: "crit_rate",
          valueNumber: 6.3,
          valueLabel: "6.3%",
        },
      ],
    }),
  ],
  mainEchoSlot: 0,
  createdAt: new Date(0).toISOString(),
  updateAt: new Date(0).toISOString(),
}

const record: BuildRecord = {
  id: "build-1",
  userId: "user-1",
  characterId: 5,
  name: "Mi build",
  payload,
  documentVersion: BUILD_DOCUMENT_VERSION,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-02T00:00:00Z"),
}

describe("build document mapping", () => {
  test("drops display-only fields and keeps canonical ids", () => {
    expect(buildToPayload(build)).toEqual(payload)
  })

  test("hydrates labels, skill levels and passive toggles from the catalog", () => {
    const hydrated = payloadToBuild({
      record,
      catalog: {
        character,
        detail,
        weapon,
        echoes: new Map([[0, echo]]),
      },
    })

    expect(hydrated.name).toBe("Mi build")
    expect(hydrated.backgroundIndex).toBe(2)
    expect(hydrated.resonator.data?.id).toBe(5)
    expect(hydrated.resonator.sequency).toBe(2)
    expect(hydrated.resonator.skills).toEqual([
      { id: 11, skillId: 1, level: 6 },
    ])
    expect(hydrated.resonator.passives[0]).toMatchObject({
      passiveId: 101,
      enabled: false,
    })
    expect(hydrated.weapon.data?.id).toBe(55)
    expect(hydrated.weapon.refinament).toBe(3)
    expect(hydrated.echoes[0]).toMatchObject({
      mainStatStat: "atk_percent",
      mainStatLabel: "Ataque %",
      level: 25,
      cost: 4,
    })
    expect(hydrated.echoes[0].mainStatValue).toBeGreaterThan(0)
    expect(hydrated.echoes[0].substats[0]).toMatchObject({
      valueStat: "crit_rate",
      valueNumber: 6.3,
      valueLabel: "Prob. Crit.",
    })
    expect(hydrated.echoes[1].data).toBeNull()
    expect(hydrated.createdAt).toBe("2026-01-01T00:00:00.000Z")
    expect(hydrated.updateAt).toBe("2026-01-02T00:00:00.000Z")
  })

  test("round-trips a hydrated document back to the same payload", () => {
    const hydrated = payloadToBuild({
      record,
      catalog: {
        character,
        detail,
        weapon,
        echoes: new Map([[0, echo]]),
      },
    })

    expect(buildToPayload(hydrated)).toEqual(payload)
  })

  test("keeps a build playable when the catalog detail is missing", () => {
    const hydrated = payloadToBuild({
      record,
      catalog: {
        character: null,
        detail: null,
        weapon: null,
        echoes: new Map(),
      },
    })

    expect(hydrated.resonator.data).toBeNull()
    expect(hydrated.resonator.passives).toEqual([])
    expect(hydrated.echoes[0].mainStatStat).toBe("atk_percent")
    expect(hydrated.echoes[0].data).toBeNull()
  })
})
