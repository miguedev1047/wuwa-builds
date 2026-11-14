import { getWeapon, getWeapons } from "@catalog/server/weapons/weapons"
import { queryOptions } from "@tanstack/react-query"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import {
  WUWA_BUILDS_GC_TIME,
  WUWA_BUILDS_STALE_TIME,
} from "@catalog/queries/cache"

export const weaponQueries = {
  list: () =>
    queryOptions({
      queryKey: wuwaBuildsKeys.weapons(),
      queryFn: () => getWeapons(),
      staleTime: WUWA_BUILDS_STALE_TIME,
      gcTime: WUWA_BUILDS_GC_TIME,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: wuwaBuildsKeys.weapon(id),
      queryFn: () => getWeapon({ data: { id } }),
      staleTime: WUWA_BUILDS_STALE_TIME,
      gcTime: WUWA_BUILDS_GC_TIME,
    }),
}
