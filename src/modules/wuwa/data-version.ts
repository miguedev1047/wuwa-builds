/**
 * Versión del dataset de resonadores, inyectada en build desde el hash de
 * `src/data/wuwa-resonators/index.json` (ver `vite.config.ts`).
 *
 * Cambia cuando se despliega un scrape nuevo. Va como prefijo de las query
 * keys, así que cualquier caché —memoria ahora, TanStack DB/SQLite después—
 * queda aislada por versión sin lógica adicional.
 */
export const WUWA_DATA_VERSION: string =
  import.meta.env.VITE_WUWA_DATA_VERSION ?? "dev"
