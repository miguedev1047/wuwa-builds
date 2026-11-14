import {
  getEcho,
  getEchoes,
  getEchoesDetailed,
} from "@catalog/server/echoes/echoes"
import { queryOptions } from "@tanstack/react-query"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import {
  WUWA_BUILDS_GC_TIME,
  WUWA_BUILDS_STALE_TIME,
} from "@catalog/queries/cache"

export const echoQueries = {
  list: () =>
    queryOptions({
      queryKey: wuwaBuildsKeys.echoes(),
      queryFn: () => getEchoes(),
      staleTime: WUWA_BUILDS_STALE_TIME,
      gcTime: WUWA_BUILDS_GC_TIME,
    }),

  details: (ids: number[]) =>
    queryOptions({
      queryKey: wuwaBuildsKeys.echoesDetailed(ids),
      queryFn: () => getEchoesDetailed({ data: { ids } }),
      staleTime: WUWA_BUILDS_STALE_TIME,
      gcTime: WUWA_BUILDS_GC_TIME,
      enabled: ids.length > 0,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: wuwaBuildsKeys.echo(id),
      queryFn: () => getEcho({ data: { id } }),
      staleTime: WUWA_BUILDS_STALE_TIME,
      gcTime: WUWA_BUILDS_GC_TIME,
    }),
}
