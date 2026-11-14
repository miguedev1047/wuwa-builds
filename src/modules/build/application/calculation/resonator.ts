import type {
  CharacterBaseStats,
  CharacterConditionalEffect,
  CharacterStatBonus,
} from "@build/domain/character-stats"
import type { ResonatorPassivesDataProps } from "@build/domain/build-record"
import { passiveStatId } from "@build/application/calculation/passive-stats"
import { RESONATOR_PROPERTY_ALIASES } from "@catalog/application/constants/resonator"
import { isStatId } from "@catalog/application/stats/stats"
import type { CharacterDetail } from "@catalog/domain/character"
import { growthValueAtLevel } from "@catalog/domain/character"

export interface ResolvedResonatorStats {
  base: CharacterBaseStats
  bonuses: CharacterStatBonus[]
  diagnostics: string[]
  conditionalEffects: CharacterConditionalEffect[]
}

const BASE_STAT_IDS = new Set([
  "hp",
  "atk",
  "def",
  "crit_rate",
  "crit_dmg",
  "energy_regen",
])

/** Universal base energy regen; the catalog does not store it per resonator. */
const BASE_ENERGY_REGEN = 100

function normalizeResonatorStatId(name: string): string | null {
  if (isStatId(name)) return name

  return (
    RESONATOR_PROPERTY_ALIASES.find((alias) => alias.encoreName === name)
      ?.statId ?? null
  )
}

function numeric(value: number | string): number {
  if (typeof value === "number") return value

  const parsed = Number(value.replace("%", "").trim())

  return Number.isFinite(parsed) ? parsed : 0
}

/** Resolves the base stats of one resonator at a real level. */
export function resolveResonatorStats({
  detail,
  level,
  passives,
  sequence,
}: {
  detail: CharacterDetail
  level: number
  passives: ResonatorPassivesDataProps[]
  sequence: number
}): ResolvedResonatorStats {
  const diagnostics: string[] = []
  const conditionalEffects: CharacterConditionalEffect[] = []
  const bonuses: CharacterStatBonus[] = []
  const values = new Map<string, number>()

  for (const property of detail.properties) {
    const statId = normalizeResonatorStatId(property.name)

    if (!statId) {
      diagnostics.push(`Unknown resonator property: ${property.name}`)
      continue
    }

    const growth = growthValueAtLevel(property.growth, level)
    const raw = property.growth.length > 0 ? growth : property.baseValue

    values.set(statId, numeric(raw))
  }

  for (const statId of values.keys()) {
    if (!BASE_STAT_IDS.has(statId)) {
      diagnostics.push(`${statId} is not part of the resonator base stats`)
    }
  }

  for (const passive of passives) {
    if (!passive.enabled) continue

    const statId = passiveStatId(passive.name)

    if (statId) {
      if (passive.value !== 0) {
        bonuses.push({
          statId,
          value: passive.value,
          source: `Pasiva ${passive.name}`,
        })
      }

      continue
    }

    conditionalEffects.push({
      source: "Pasiva",
      description: `${passive.name}: ${passive.value}`,
    })
  }

  for (const entry of detail.sequences) {
    if (entry.index > sequence) continue

    conditionalEffects.push({
      source: "Secuencia",
      description: entry.description,
    })
  }

  return {
    base: {
      hp: values.get("hp") ?? 0,
      atk: values.get("atk") ?? 0,
      def: values.get("def") ?? 0,
      crit_rate: values.get("crit_rate") ?? 5,
      crit_dmg: values.get("crit_dmg") ?? 150,
      energy_regen: values.get("energy_regen") ?? BASE_ENERGY_REGEN,
    },
    bonuses,
    diagnostics,
    conditionalEffects,
  }
}
