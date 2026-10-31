import {
  getEcho,
  getEchoes,
} from "@/modules/panel/admin/game-data/server/echoes"
import { queryOptions } from "@tanstack/react-query"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import {
  WUWA_BUILDS_GC_TIME,
  WUWA_BUILDS_STALE_TIME,
} from "@/modules/panel/admin/game-data/queries/cache"

export const echoQueries = {
  list: () =>
    queryOptions({
      queryKey: wuwaBuildsKeys.echoes(),
      queryFn: () => getEchoes(),
      staleTime: WUWA_BUILDS_STALE_TIME,
      gcTime: WUWA_BUILDS_GC_TIME,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: wuwaBuildsKeys.echo(id),
      queryFn: () => getEcho({ data: { id } }),
      staleTime: WUWA_BUILDS_STALE_TIME,
      gcTime: WUWA_BUILDS_GC_TIME,
    }),
}
