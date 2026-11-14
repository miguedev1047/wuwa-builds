import type { ResonatorPassivesDataProps } from "@build/domain/build-record"
import {
  normalizePassiveTitle,
  passiveStatId,
} from "@build/application/calculation/passive-stats"

/** One stat the enabled passives add up to, ready for a bonus pill. */
export interface ResonatorBonus {
  /** Canonical stat id, or null for a named passive the map does not cover. */
  statId: string | null
  name: string
  icon: string
  value: number
}

/** Two decimals are the finest value the bonus pills show. */
const BONUS_PRECISION = 100

function bonusKey(name: string, statId: string | null): string {
  return statId ?? normalizePassiveTitle(name).toUpperCase()
}

function hasVisibleValue(value: number): boolean {
  return Math.round(value * BONUS_PRECISION) > 0
}

/**
 * Sums the enabled passives of the build by stat.
 *
 * Aliases that share a canonical stat collapse into one entry, so two titles
 * that mean the same bonus never render as two pills. Named passives keep their
 * own title as the identity, disabled passives stay out of the totals, and a
 * group whose total rounds to zero is dropped instead of rendering an empty
 * pill.
 */
export function resolveResonatorBonuses(
  passives: ResonatorPassivesDataProps[]
): ResonatorBonus[] {
  const totals = new Map<string, ResonatorBonus>()

  for (const passive of passives) {
    if (!passive.enabled) continue

    const statId = passiveStatId(passive.name)
    const key = bonusKey(passive.name, statId)
    const current = totals.get(key)

    if (current) {
      current.value += passive.value
      continue
    }

    totals.set(key, {
      statId,
      name: passive.name,
      icon: passive.icon,
      value: passive.value,
    })
  }

  return [...totals.values()].filter((bonus) => hasVisibleValue(bonus.value))
}
