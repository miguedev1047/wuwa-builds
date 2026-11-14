import type {
  CharacterConditionalEffect,
  CharacterStatBonus,
} from "@build/domain/character-stats"
import {
  isWeaponPropertyStatId,
  weaponPropertyStatId,
} from "@catalog/application/constants/weapon"
import { isStatId } from "@catalog/application/stats/stats"
import { growthValueAtLevel } from "@catalog/domain/character"
import type { WeaponDetail } from "@catalog/domain/weapon"

export interface ResolvedWeaponStats {
  baseAtk: number
  bonuses: CharacterStatBonus[]
  diagnostics: string[]
  conditionalEffects: CharacterConditionalEffect[]
}

type WeaponProperty = WeaponDetail["properties"][number]

function isPercentProperty(property: WeaponProperty): boolean {
  const levelOne =
    property.growth.find((entry) => entry.level === 1) ?? property.growth[0]
  const value = levelOne?.valueText

  return typeof value === "string" && value.trim().endsWith("%")
}

function normalizeWeaponStatId(property: WeaponProperty): string | null {
  if (isWeaponPropertyStatId(property.name)) return property.name

  return weaponPropertyStatId(property.name, isPercentProperty(property))
}

function numeric(value: number | string): number {
  if (typeof value === "number") return value

  const parsed = Number(value.replace("%", "").trim())

  return Number.isFinite(parsed) ? parsed : 0
}

/** The game shows weapon secondary stats with one decimal. */
function roundToTenth(value: number): number {
  return Math.round(value * 10) / 10
}

/** Resolves weapon base attack, secondary stat and refinement bonuses. */
export function resolveWeaponStats({
  detail,
  level,
  refinementRank,
}: {
  detail: WeaponDetail
  level: number
  refinementRank: number
}): ResolvedWeaponStats {
  const diagnostics: string[] = []
  const conditionalEffects: CharacterConditionalEffect[] = []
  const bonuses: CharacterStatBonus[] = []

  const normalized = detail.properties.map((property) => ({
    property,
    statId: normalizeWeaponStatId(property),
  }))

  const baseProperty =
    normalized.find((item) => item.statId === "atk") ?? normalized[0]

  const baseAtk = baseProperty
    ? numeric(
        baseProperty.property.growth.length > 0
          ? growthValueAtLevel(baseProperty.property.growth, level)
          : baseProperty.property.baseValue
      )
    : 0

  const secondary = normalized.find((item) => item !== baseProperty)

  if (secondary) {
    if (secondary.statId) {
      const value = roundToTenth(
        numeric(
          secondary.property.growth.length > 0
            ? growthValueAtLevel(secondary.property.growth, level)
            : secondary.property.baseValue
        )
      )

      if (value !== 0) {
        bonuses.push({
          statId: secondary.statId,
          value,
          source: "Arma",
        })
      }
    } else {
      diagnostics.push(`Unknown weapon property: ${secondary.property.name}`)
    }
  }

  const refinement = detail.refinements.find(
    (item) => item.sortOrder === refinementRank
  )

  if (refinement) {
    for (const stat of refinement.stats) {
      if (!isStatId(stat.statName)) {
        diagnostics.push(`Unknown refinement stat: ${stat.statName}`)
        continue
      }

      if (stat.statNumber === 0) continue

      bonuses.push({
        statId: stat.statName,
        value: stat.statNumber,
        source: `Refinamiento ${refinementRank}`,
      })
    }

    if (refinement.effect) {
      conditionalEffects.push({
        source: `Refinamiento ${refinementRank}`,
        description: refinement.effect,
      })
    }
  } else if (detail.refinements.length > 0) {
    diagnostics.push(`Refinement rank ${refinementRank} not found`)
  }

  return { baseAtk, bonuses, diagnostics, conditionalEffects }
}
