import { queryOptions } from "@tanstack/react-query"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import {
  WUWA_BUILDS_GC_TIME,
  WUWA_BUILDS_STALE_TIME,
} from "@/modules/panel/admin/game-data/queries/cache"
import { getSonatas } from "@/modules/panel/admin/game-data/server/echoes/sonatas"

export const sonataQueries = {
  list: () =>
    queryOptions({
      queryKey: wuwaBuildsKeys.sonatas(),
      queryFn: () => getSonatas(),
      staleTime: WUWA_BUILDS_STALE_TIME,
      gcTime: WUWA_BUILDS_GC_TIME,
    }),
}
