import { SELECT_ECHO_MAIN_STATS } from "@/modules/builds/constants/stats"

export interface EchoMainStatOption {
  stat: string
  label: string
  values: number[]
}

export interface EchoPrimaryStatOption {
  stat: string
  label: string
  value: number
}

interface EchoMainStatEntry {
  primaryStat: EchoPrimaryStatOption[]
  levels: EchoMainStatOption[]
}

const MAIN_STATS_BY_COST: Record<number, EchoMainStatEntry> = {
  1: SELECT_ECHO_MAIN_STATS[1],
  3: SELECT_ECHO_MAIN_STATS[3],
  4: SELECT_ECHO_MAIN_STATS[4],
}

function levelIndex(level: number, length: number): number {
  return Math.min(Math.max(Math.floor(level / 5), 0), length - 1)
}

/** Selectable main stats available for an echo cost. */
export function echoMainStatOptions(cost: number): EchoMainStatOption[] {
  return MAIN_STATS_BY_COST[cost]?.levels ?? []
}

/** Flat primary stat every echo of a cost has at its current level. */
export function echoPrimaryStat({
  cost,
  level,
}: {
  cost: number
  level: number
}): EchoPrimaryStatOption | null {
  const options = MAIN_STATS_BY_COST[cost]?.primaryStat ?? []

  if (options.length === 0) return null

  return options[levelIndex(level, options.length)] ?? null
}

/** Value of a selectable main stat at the echo level. */
export function echoMainStatValue({
  cost,
  stat,
  level,
}: {
  cost: number
  stat: string
  level: number
}): number {
  const option = echoMainStatOptions(cost).find((item) => item.stat === stat)

  if (!option) return 0

  return option.values[levelIndex(level, option.values.length)] ?? 0
}
