import { queryOptions } from "@tanstack/react-query"
import {
  getEcho,
  getEchoes,
  getWeapon,
  getWeapons,
} from "@encore/server/catalogs"
import { ENCORE_GC_TIME, ENCORE_STALE_TIME } from "@encore/queries/cache"
import { encoreKeys } from "@encore/queries/keys"

export const encoreWeaponQueries = {
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

export const encoreEchoQueries = {
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
