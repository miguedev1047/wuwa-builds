/**
 * Query keys for the canonical D1 catalog.
 *
 * Admin and builder screens share this namespace, so an invalidation after an
 * admin mutation also refreshes the builder. Freshness follows each query's
 * `staleTime` (see `cache.ts`), not a deploy-time data version.
 */
export const wuwaBuildsKeys = {
  all: ["wuwa-builds"] as const,
  characters: () => [...wuwaBuildsKeys.all, "characters"] as const,
  character: (id: number) => [...wuwaBuildsKeys.all, "character", id] as const,
  weapons: () => [...wuwaBuildsKeys.all, "weapons"] as const,
  weapon: (id: number) => [...wuwaBuildsKeys.all, "weapon", id] as const,
  echoes: () => [...wuwaBuildsKeys.all, "echoes"] as const,
  echoesDetailed: (ids: number[]) =>
    [
      ...wuwaBuildsKeys.all,
      "echoes",
      "details",
      ...ids.slice().sort((left, right) => left - right),
    ] as const,
  echo: (id: number) => [...wuwaBuildsKeys.all, "echo", id] as const,
  sonatas: () => [...wuwaBuildsKeys.all, "sonatas"] as const,
}
