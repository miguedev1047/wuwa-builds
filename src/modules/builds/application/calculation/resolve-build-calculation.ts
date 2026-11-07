import type { CharacterCalculationResult } from "@/modules/builds/domain/character-stats"
import type { BuildProps } from "@/modules/builds/domain/build-record"
import type { CharacterDetail } from "@/modules/game-data/domain/character"
import type { EchoDetail } from "@/modules/game-data/domain/echo"
import type { SonataCatalogEntry } from "@/modules/game-data/domain/sonata"
import type { WeaponDetail } from "@/modules/game-data/domain/weapon"
import { calculateCharacterStats } from "@/modules/builds/domain/character-stats"
import {
  normalizeElementId,
  normalizeWeaponTypeId,
} from "@/modules/builds/application/calculation/normalize"
import { resolveEchoBonuses } from "@/modules/builds/application/calculation/echoes"
import { resolveEchoSkillBonuses } from "@/modules/builds/application/calculation/echo-skill-bonuses"
import { resolveResonatorStats } from "@/modules/builds/application/calculation/resonator"
import { resolveSonataBonuses } from "@/modules/builds/application/calculation/sonata"
import { resolveWeaponStats } from "@/modules/builds/application/calculation/weapon"

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

  const element = normalizeElementId(build.resonator.data?.element)
  const elementDiagnostics =
    build.resonator.data?.element && element === null
      ? [`Unknown resonator element: ${build.resonator.data.element}`]
      : []

  const echoSkillBonuses = resolveEchoSkillBonuses({
    echoes: build.echoes,
    details: echoDetails,
    context: {
      resonatorId: build.resonator.data?.id ?? null,
      element,
      weaponType: normalizeWeaponTypeId(build.resonator.data?.weaponType),
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
