/**
 * Query keys for Encore game data.
 *
 * `WUWA_DATA_VERSION` is intentionally absent: Encore data is not part of the
 * deployed JSON bundle, and its freshness is controlled by the API cache TTL.
 */
export const encoreKeys = {
  all: ["encore"] as const,
  characters: () => [...encoreKeys.all, "characters"] as const,
  character: (id: number) => [...encoreKeys.all, "character", id] as const,
  weapons: () => [...encoreKeys.all, "weapons"] as const,
  weapon: (id: number) => [...encoreKeys.all, "weapon", id] as const,
  echoes: () => [...encoreKeys.all, "echoes"] as const,
  echo: (id: number) => [...encoreKeys.all, "echo", id] as const,
}
