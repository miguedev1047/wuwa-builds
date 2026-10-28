import { WUWA_DATA_VERSION } from "../data-version"

/**
 * Query keys del dominio.
 *
 * El prefijo `["wuwa", WUWA_DATA_VERSION]` hace que un deploy con datos nuevos
 * cambie todas las keys: la caché vieja se ignora (y una futura persistencia
 * con TanStack DB/SQLite puede limpiar por prefijo sin adivinar).
 */
export const resonatorKeys = {
  all: ["wuwa", WUWA_DATA_VERSION] as const,
  index: () => [...resonatorKeys.all, "resonators"] as const,
  detail: (slug: string) => [...resonatorKeys.all, "resonators", slug] as const,
}
