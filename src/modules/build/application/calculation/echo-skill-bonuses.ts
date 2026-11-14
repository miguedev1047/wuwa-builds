import type {
  CharacterConditionalEffect,
  CharacterStatBonus,
} from "@build/domain/character-stats"
import type { EchoesDataProps } from "@build/domain/build-record"
import { statLabel } from "@catalog/application/stats/stats"
import { isStatId } from "@catalog/application/stats/stats"
import type { EchoDetail } from "@catalog/domain/echo"
import {
  normalizeElementId,
  normalizeWeaponTypeId,
} from "@build/application/calculation/normalize"

export interface ResolvedEchoSkillBonuses {
  bonuses: CharacterStatBonus[]
  conditionalEffects: CharacterConditionalEffect[]
  diagnostics: string[]
}

export interface EchoSkillBonusContext {
  resonatorId: number | null
  element: string | null
  weaponType: string | null
  mainEchoSlot: number | null
}

/** Echo skill bonuses whose static conditions match the current build. */
export function resolveEchoSkillBonuses({
  echoes,
  details,
  context,
}: {
  echoes: EchoesDataProps[]
  details: EchoDetail[]
  context: EchoSkillBonusContext
}): ResolvedEchoSkillBonuses {
  const bonuses: CharacterStatBonus[] = []
  const conditionalEffects: CharacterConditionalEffect[] = []
  const diagnostics: string[] = []

  for (const detail of details) {
    const slotIndex = echoes.findIndex((echo) => echo.data?.id === detail.id)

    if (slotIndex === -1) continue

    for (const bonus of detail.skillBonuses) {
      if (bonus.condition === "combat") {
        conditionalEffects.push({
          source: detail.name,
          description: `${statLabel(bonus.statId)} +${bonus.value}%`,
        })
        continue
      }

      if (
        bonus.condition === "resonator" &&
        String(context.resonatorId) !== bonus.conditionValue
      ) {
        continue
      }

      if (
        bonus.condition === "element" &&
        context.element !== normalizeElementId(bonus.conditionValue)
      ) {
        continue
      }

      if (
        bonus.condition === "weaponType" &&
        context.weaponType !== normalizeWeaponTypeId(bonus.conditionValue)
      ) {
        continue
      }

      if (
        bonus.condition !== "none" &&
        bonus.condition !== "resonator" &&
        bonus.condition !== "element" &&
        bonus.condition !== "weaponType"
      ) {
        diagnostics.push(`Unknown echo bonus condition: ${bonus.condition}`)
        continue
      }

      if (bonus.requiresMainSlot && context.mainEchoSlot !== slotIndex) {
        conditionalEffects.push({
          source: detail.name,
          description: `Requiere eco principal: ${statLabel(bonus.statId)} +${bonus.value}%`,
        })
        continue
      }

      if (!isStatId(bonus.statId)) {
        diagnostics.push(`Unknown echo bonus stat: ${bonus.statId}`)
        continue
      }

      bonuses.push({
        statId: bonus.statId,
        value: bonus.value,
        source: detail.name,
      })
    }
  }

  return { bonuses, conditionalEffects, diagnostics }
}
