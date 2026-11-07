import { SELECT_ECHO_MAIN_STATS } from "@/modules/builds/constants/stats"

export type EchoMainStatOption = (typeof SELECT_ECHO_MAIN_STATS)[1][number]

const MAIN_STATS_BY_COST: Record<number, EchoMainStatOption[]> = {
  1: SELECT_ECHO_MAIN_STATS[1],
  3: SELECT_ECHO_MAIN_STATS[3],
  4: SELECT_ECHO_MAIN_STATS[4],
}

/** Main stat options available for an echo cost. */
export function echoMainStatOptions(cost: number): EchoMainStatOption[] {
  return MAIN_STATS_BY_COST[cost] ?? []
}

/** Value of a main stat at the echo level, using five-level breakpoints. */
export function echoMainStatValue({
  cost,
  label,
  level,
}: {
  cost: number
  label: string
  level: number
}): number {
  const option = echoMainStatOptions(cost).find((item) => item.label === label)

  if (!option) return 0

  const index = Math.min(
    Math.max(Math.floor(level / 5), 0),
    option.values.length - 1
  )

  return option.values[index] ?? 0
}
