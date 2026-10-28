import { queryOptions } from "@tanstack/react-query"
import { getEcho, getEchoes, getWeapon, getWeapons } from "../server/catalogs"
import { ENCORE_GC_TIME, ENCORE_STALE_TIME } from "./cache"
import { encoreKeys } from "./keys"

export const weaponQueries = {
  list: () =>
    queryOptions({
      queryKey: encoreKeys.weapons(),
      queryFn: () => getWeapons(),
      staleTime: ENCORE_STALE_TIME,
      gcTime: ENCORE_GC_TIME,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: encoreKeys.weapon(id),
      queryFn: () => getWeapon({ data: { id } }),
      staleTime: ENCORE_STALE_TIME,
      gcTime: ENCORE_GC_TIME,
    }),
}

export const echoQueries = {
  list: () =>
    queryOptions({
      queryKey: encoreKeys.echoes(),
      queryFn: () => getEchoes(),
      staleTime: ENCORE_STALE_TIME,
      gcTime: ENCORE_GC_TIME,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: encoreKeys.echo(id),
      queryFn: () => getEcho({ data: { id } }),
      staleTime: ENCORE_STALE_TIME,
      gcTime: ENCORE_GC_TIME,
    }),
}
