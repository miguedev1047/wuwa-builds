import type {
  CharacterConditionalEffect,
  CharacterStatBonus,
} from "@build/domain/character-stats"
import type { EchoesDataProps } from "@build/domain/build-record"
import type { SonataCatalogEntry } from "@catalog/domain/sonata"

export interface ResolvedSonataBonuses {
  bonuses: CharacterStatBonus[]
  conditionalEffects: CharacterConditionalEffect[]
  diagnostics: string[]
}

/** Static sonata effects reached by the equipped echo sets. */
export function resolveSonataBonuses(
  echoes: EchoesDataProps[],
  sonatas: SonataCatalogEntry[]
): ResolvedSonataBonuses {
  const counts = new Map<number, number>()
  const bonuses: CharacterStatBonus[] = []
  const conditionalEffects: CharacterConditionalEffect[] = []
  const diagnostics: string[] = []

  for (const echo of echoes) {
    if (!echo.data || echo.echoSetId === null) continue

    counts.set(echo.echoSetId, (counts.get(echo.echoSetId) ?? 0) + 1)
  }

  for (const [setId, count] of counts) {
    const sonata = sonatas.find((item) => item.id === setId)

    if (!sonata) {
      diagnostics.push(`Sonata ${setId} not found`)
      continue
    }

    for (const effect of sonata.effects) {
      if (effect.pieces > count) continue

      if (effect.isConditional) {
        conditionalEffects.push({
          source: sonata.name,
          description: effect.description,
        })
        continue
      }

      if (effect.statId === null || effect.value === null) {
        diagnostics.push(`Sonata ${sonata.name} effect has no stat`)
        continue
      }

      bonuses.push({
        statId: effect.statId,
        value: effect.value,
        source: sonata.name,
      })
    }
  }

  return { bonuses, conditionalEffects, diagnostics }
}
