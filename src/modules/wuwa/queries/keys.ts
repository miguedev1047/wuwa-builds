import { WUWA_DATA_VERSION } from "../data-version"

/**
 * Versioned query keys for immutable game data.
 *
 * A data refresh changes the shared prefix so cached catalog data is ignored.
 */
export const wuwaKeys = {
  all: ["wuwa", WUWA_DATA_VERSION] as const,
}

export const resonatorKeys = {
  all: [...wuwaKeys.all, "resonators"] as const,
  index: () => [...resonatorKeys.all, "index"] as const,
  detail: (slug: string) => [...resonatorKeys.all, "detail", slug] as const,
}

export const weaponKeys = {
  all: [...wuwaKeys.all, "weapons"] as const,
  catalog: () => [...weaponKeys.all, "catalog"] as const,
  detail: (lookup: { id?: string; slug?: string }) =>
    [
      ...weaponKeys.all,
      "detail",
      lookup.id ? "id" : "slug",
      lookup.id ?? lookup.slug,
    ] as const,
}

export const echoKeys = {
  all: [...wuwaKeys.all, "echoes"] as const,
  catalog: () => [...echoKeys.all, "catalog"] as const,
  detail: (lookup: { id?: string; slug?: string }) =>
    [
      ...echoKeys.all,
      "detail",
      lookup.id ? "id" : "slug",
      lookup.id ?? lookup.slug,
    ] as const,
}

export const echoSetKeys = {
  all: [...wuwaKeys.all, "echo-sets"] as const,
  catalog: () => [...echoSetKeys.all, "catalog"] as const,
  detail: (lookup: { sonataId?: number; slug?: string }) =>
    [
      ...echoSetKeys.all,
      "detail",
      lookup.sonataId !== undefined ? "sonataId" : "slug",
      lookup.sonataId ?? lookup.slug,
    ] as const,
}
