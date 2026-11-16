import { isElementId } from "@/modules/game-data/domain/categories"
import type { CharacterCalculationResult } from "@build/domain/character-stats"
import type { BuildProps } from "@build/domain/build-record"
import type { CharacterDetail } from "@catalog/domain/character"
import type { EchoDetail } from "@catalog/domain/echo"
import type { SonataCatalogEntry } from "@catalog/domain/sonata"
import type { WeaponDetail } from "@catalog/domain/weapon"
import { calculateCharacterStats } from "@build/domain/character-stats"
import { resolveEchoBonuses } from "@build/application/calculation/echoes"
import { resolveEchoSkillBonuses } from "@build/application/calculation/echo-skill-bonuses"
import { resolveResonatorStats } from "@build/application/calculation/resonator"
import { resolveSonataBonuses } from "@build/application/calculation/sonata"
import { resolveWeaponStats } from "@build/application/calculation/weapon"

export interface BuildCalculationSources {
  build: BuildProps
  resonator: CharacterDetail | null
  weapon: WeaponDetail | null
  echoDetails: EchoDetail[]
  sonatas: SonataCatalogEntry[]
}

/** Resolves catalog sources and calculates the final build stats. */
export function resolveBuildCalculation({
  build,
  resonator,
  weapon,
  echoDetails,
  sonatas,
}: BuildCalculationSources): CharacterCalculationResult | null {
  if (!resonator) return null

  const resonatorStats = resolveResonatorStats({
    detail: resonator,
    level: build.resonator.level,
    passives: build.resonator.passives,
    sequence: build.resonator.sequency,
  })

  const weaponStats = weapon
    ? resolveWeaponStats({
        detail: weapon,
        level: build.weapon.level,
        refinementRank: build.weapon.refinament,
      })
    : {
        baseAtk: 0,
        bonuses: [],
        diagnostics: [],
        conditionalEffects: [],
      }

  const echoBonuses = resolveEchoBonuses(build.echoes)

  const sonataBonuses = resolveSonataBonuses(build.echoes, sonatas)

  const element = build.resonator.data?.element ?? null
  const elementDiagnostics =
    element && !isElementId(element)
      ? [`Unknown resonator element: ${element}`]
      : []

  const echoSkillBonuses = resolveEchoSkillBonuses({
    echoes: build.echoes,
    details: echoDetails,
    context: {
      resonatorId: build.resonator.data?.id ?? null,
      element,
      weaponType: build.resonator.data?.weaponType ?? null,
      mainEchoSlot: build.mainEchoSlot ?? null,
    },
  })

  return calculateCharacterStats({
    base: resonatorStats.base,
    weaponBaseAtk: weaponStats.baseAtk,
    bonuses: [
      ...resonatorStats.bonuses,
      ...weaponStats.bonuses,
      ...echoBonuses,
      ...sonataBonuses.bonuses,
      ...echoSkillBonuses.bonuses,
    ],
    diagnostics: [
      ...resonatorStats.diagnostics,
      ...weaponStats.diagnostics,
      ...sonataBonuses.diagnostics,
      ...echoSkillBonuses.diagnostics,
      ...elementDiagnostics,
    ],
    conditionalEffects: [
      ...resonatorStats.conditionalEffects,
      ...weaponStats.conditionalEffects,
      ...sonataBonuses.conditionalEffects,
      ...echoSkillBonuses.conditionalEffects,
    ],
  })
}
