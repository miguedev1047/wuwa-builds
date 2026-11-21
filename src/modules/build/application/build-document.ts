import type { BuildRecord } from "@build/application/ports/build-repository"
import {
  createEmptyEchoSlot,
  type BuildPayload,
  type EchoSlot,
} from "@build/domain/build"
import {
  createEmptyEchoes,
  createResonatorPassives,
  createResonatorSkills,
} from "@build/application/factories/build"
import {
  echoMainStatOptions,
  echoMainStatValue,
} from "@build/application/echo-main-stat"
import {
  echoSubstatOptions,
  formatEchoSubstatValue,
} from "@build/application/echo-substats"
import type {
  BuildProps,
  EchoesDataProps,
  ResonatorDataProps,
  WeaponDataProps,
} from "@build/domain/build-record"
import type {
  CharacterDetail,
  CharacterSummary,
} from "@catalog/domain/character"
import type { EchoSummary } from "@catalog/domain/echo"
import type { WeaponSummary } from "@catalog/domain/weapon"

/** Catalog rows needed to turn a saved payload back into an editor document. */
export interface BuildCatalogContext {
  character: CharacterSummary | null
  detail: CharacterDetail | null
  weapon: WeaponSummary | null
  echoes: ReadonlyMap<number, EchoSummary>
}

export interface BuildDocumentInput {
  record: BuildRecord
  catalog: BuildCatalogContext
}

function toIso(value: Date | string): string {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString()
}

function mainEchoSlotValue(value: number | null): BuildPayload["mainEchoSlot"] {
  if (value === 0 || value === 1 || value === 2 || value === 3 || value === 4) {
    return value
  }

  return null
}

function echoSlotPayload(echo: EchoesDataProps): EchoSlot {
  return {
    echoId: echo.data?.id ?? null,
    level: echo.level,
    mainStatId: echo.mainStatStat || null,
    sonataId: echo.echoSetId,
    substats: echo.substats
      .filter((substat) => substat.valueStat !== "")
      .slice(0, 5)
      .map((substat) => ({
        statId: substat.valueStat,
        value: substat.valueNumber,
      })),
  }
}

/** Saved payload for the current editor document. Display-only fields are dropped. */
export function buildToPayload(build: BuildProps): BuildPayload {
  const echoByIndex = new Map(build.echoes.map((echo) => [echo.index, echo]))
  const echoAt = (index: number) => {
    const echo = echoByIndex.get(index)

    return echo ? echoSlotPayload(echo) : createEmptyEchoSlot()
  }

  return {
    resonator: {
      level: build.resonator.level,
      sequenceRank: build.resonator.sequency,
      skillLevels: build.resonator.skills.map((skill) => ({
        skillId: skill.skillId,
        level: skill.level,
      })),
      passives: build.resonator.passives.map((passive) => ({
        passiveId: passive.passiveId,
        enabled: passive.enabled,
      })),
    },
    weapon: {
      weaponId: build.weapon.data?.id ?? null,
      level: build.weapon.level,
      refinementRank: build.weapon.refinament,
    },
    echoLoadout: [echoAt(0), echoAt(1), echoAt(2), echoAt(3), echoAt(4)],
    mainEchoSlot: mainEchoSlotValue(build.mainEchoSlot),
    backgroundIndex: build.backgroundIndex,
    notes: "",
  }
}

function hydrateSkills(
  detail: CharacterDetail | null,
  payload: BuildPayload
): ResonatorDataProps["skills"] {
  const levelBySkill = new Map(
    payload.resonator.skillLevels.map((skill) => [skill.skillId, skill.level])
  )

  if (!detail) {
    return payload.resonator.skillLevels.map((skill) => ({
      id: skill.skillId,
      skillId: skill.skillId,
      level: skill.level,
    }))
  }

  return createResonatorSkills(detail.skills).map((skill) => ({
    ...skill,
    level: levelBySkill.get(skill.skillId) ?? skill.level,
  }))
}

function hydratePassives(
  detail: CharacterDetail | null,
  payload: BuildPayload
): ResonatorDataProps["passives"] {
  if (!detail) return []

  // Documents saved before v2 have no passive toggles; the catalog defaults win.
  const enabledByPassive = new Map(
    (payload.resonator.passives ?? []).map((passive) => [
      passive.passiveId,
      passive.enabled,
    ])
  )

  return createResonatorPassives(detail).map((passive) => ({
    ...passive,
    enabled: enabledByPassive.get(passive.passiveId) ?? passive.enabled,
  }))
}

function hydrateSubstats(
  cost: number,
  substats: EchoesDataProps["substats"],
  payloadSubstats: EchoSlot["substats"]
): EchoesDataProps["substats"] {
  const options = echoSubstatOptions(cost)

  return substats.map((empty, index) => {
    const saved = payloadSubstats[index]
    if (!saved) return empty

    const option = options.find((entry) => entry.stat === saved.statId)

    return {
      index,
      valueStat: saved.statId,
      valueNumber: saved.value,
      valueLabel: option
        ? formatEchoSubstatValue(option.label, saved.value)
        : String(saved.value),
    }
  })
}

function hydrateEchoes(
  payload: BuildPayload,
  echoes: ReadonlyMap<number, EchoSummary>
): EchoesDataProps[] {
  return createEmptyEchoes().map((empty, index) => {
    const saved = payload.echoLoadout[index] ?? createEmptyEchoSlot()
    const data = echoes.get(index) ?? null
    const cost = data?.cost ?? 0
    const mainStat = saved.mainStatId ?? ""
    const mainStatOption = mainStat
      ? echoMainStatOptions(cost).find((option) => option.stat === mainStat)
      : undefined

    return {
      ...empty,
      data,
      echoSetId: saved.sonataId,
      mainStatStat: mainStat,
      mainStatLabel: mainStatOption?.label ?? "",
      mainStatValue: mainStat
        ? echoMainStatValue({ cost, stat: mainStat, level: saved.level })
        : 0,
      level: saved.level,
      cost,
      substats: hydrateSubstats(cost, empty.substats, saved.substats),
    }
  })
}

/** Editor document rebuilt from a saved row and the catalog rows it references. */
export function payloadToBuild({
  record,
  catalog,
}: BuildDocumentInput): BuildProps {
  const { payload } = record
  const weapon: WeaponDataProps = {
    level: payload.weapon.level,
    refinament: payload.weapon.refinementRank,
    data: catalog.weapon,
  }

  return {
    buildId: record.id,
    userId: record.userId,
    backgroundIndex: payload.backgroundIndex ?? null,
    name: record.name,
    resonator: {
      level: payload.resonator.level,
      sequency: payload.resonator.sequenceRank,
      data: catalog.character,
      skills: hydrateSkills(catalog.detail, payload),
      passives: hydratePassives(catalog.detail, payload),
    },
    weapon,
    echoes: hydrateEchoes(payload, catalog.echoes),
    mainEchoSlot: payload.mainEchoSlot,
    createdAt: toIso(record.createdAt),
    updateAt: toIso(record.updatedAt),
  }
}
