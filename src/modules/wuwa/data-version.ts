/**
 * Version of the resonator dataset, injected at build time from the hash of
 * `src/data/wuwa-resonators/index.json` (see `vite.config.ts`).
 *
 * It changes when a new scrape is deployed. It prefixes the query keys, so any
 * cache — memory now, TanStack DB/SQLite later — stays isolated per version
 * with no extra logic.
 */
export const WUWA_DATA_VERSION: string =
  import.meta.env.VITE_WUWA_DATA_VERSION ?? "dev"
