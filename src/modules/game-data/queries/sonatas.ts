import { queryOptions } from "@tanstack/react-query"
import { wuwaBuildsKeys } from "@/modules/game-data/queries/keys"
import {
  WUWA_BUILDS_GC_TIME,
  WUWA_BUILDS_STALE_TIME,
} from "@/modules/game-data/queries/cache"
import { getSonatas } from "@/modules/game-data/server/echoes/sonatas"

export const sonataQueries = {
  list: () =>
    queryOptions({
      queryKey: wuwaBuildsKeys.sonatas(),
      queryFn: () => getSonatas(),
      staleTime: WUWA_BUILDS_STALE_TIME,
      gcTime: WUWA_BUILDS_GC_TIME,
    }),
}
