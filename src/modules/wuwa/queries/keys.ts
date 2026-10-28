import { WUWA_DATA_VERSION } from "../data-version"

/**
 * Query keys for the domain.
 *
 * The `["wuwa", WUWA_DATA_VERSION]` prefix means a deploy with new data changes
 * every key: the old cache is ignored (and a future TanStack DB/SQLite
 * persistence can clear it by prefix without guessing).
 */
export const resonatorKeys = {
  all: ["wuwa", WUWA_DATA_VERSION] as const,
  index: () => [...resonatorKeys.all, "resonators"] as const,
  detail: (slug: string) => [...resonatorKeys.all, "resonators", slug] as const,
}
