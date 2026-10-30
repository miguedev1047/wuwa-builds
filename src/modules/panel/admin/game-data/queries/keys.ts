/**
 * Query keys for Wuwa Builds game data.
 *
 * Keys are not tied to a deploy-time data version: Wuwa Builds freshness is
 * controlled by the API cache TTL.
 */
export const wuwaBuildsKeys = {
  all: ["wuwa-builds"] as const,
  characters: () => [...wuwaBuildsKeys.all, "characters"] as const,
  character: (id: number) => [...wuwaBuildsKeys.all, "character", id] as const,
  weapons: () => [...wuwaBuildsKeys.all, "weapons"] as const,
  weapon: (id: number) => [...wuwaBuildsKeys.all, "weapon", id] as const,
  echoes: () => [...wuwaBuildsKeys.all, "echoes"] as const,
  echo: (id: number) => [...wuwaBuildsKeys.all, "echo", id] as const,
}
