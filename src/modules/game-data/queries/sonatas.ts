import { queryOptions } from "@tanstack/react-query"
import { wuwaBuildsKeys } from "@game-data/queries/keys"
import {
  WUWA_BUILDS_GC_TIME,
  WUWA_BUILDS_STALE_TIME,
} from "@game-data/queries/cache"
import { getSonatas } from "@game-data/server/echoes/sonatas"

export const sonataQueries = {
  list: () =>
    queryOptions({
      queryKey: wuwaBuildsKeys.sonatas(),
      queryFn: () => getSonatas(),
      staleTime: WUWA_BUILDS_STALE_TIME,
      gcTime: WUWA_BUILDS_GC_TIME,
    }),
}
