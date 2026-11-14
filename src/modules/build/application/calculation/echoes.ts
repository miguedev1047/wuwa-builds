import { echoPrimaryStat } from "@build/application/echo-main-stat"
import type { CharacterStatBonus } from "@build/domain/character-stats"
import type { EchoesDataProps } from "@build/domain/build-record"

/** Flat primary stats, selected main stats and substats of equipped echoes. */
export function resolveEchoBonuses(
  echoes: EchoesDataProps[]
): CharacterStatBonus[] {
  const bonuses: CharacterStatBonus[] = []

  for (const echo of echoes) {
    if (!echo.data) continue

    const cost = echo.cost || echo.data.cost || 0
    const primary = echoPrimaryStat({ cost, level: echo.level })

    if (primary && primary.value !== 0) {
      bonuses.push({
        statId: primary.stat,
        value: primary.value,
        source: `Eco ${echo.index + 1} base`,
      })
    }

    if (echo.mainStatStat && echo.mainStatValue !== 0) {
      bonuses.push({
        statId: echo.mainStatStat,
        value: echo.mainStatValue,
        source: `Eco ${echo.index + 1} main`,
      })
    }

    for (const substat of echo.substats) {
      if (!substat.valueStat || substat.valueNumber === 0) continue

      bonuses.push({
        statId: substat.valueStat,
        value: substat.valueNumber,
        source: `Eco ${echo.index + 1} substat`,
      })
    }
  }

  return bonuses
}
