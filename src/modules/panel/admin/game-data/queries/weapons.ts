import {
  getWeapon,
  getWeapons,
} from "@/modules/panel/admin/game-data/server/weapons"
import { queryOptions } from "@tanstack/react-query"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import {
  WUWA_BUILDS_GC_TIME,
  WUWA_BUILDS_STALE_TIME,
} from "@/modules/panel/admin/game-data/queries/cache"

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
