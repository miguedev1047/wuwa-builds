import {
  getCharacter,
  getCharacters,
} from "@catalog/server/resonators/resonators"
import { queryOptions } from "@tanstack/react-query"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import {
  WUWA_BUILDS_GC_TIME,
  WUWA_BUILDS_STALE_TIME,
} from "@catalog/queries/cache"

export const characterQueries = {
  list: () =>
    queryOptions({
      queryKey: wuwaBuildsKeys.characters(),
      queryFn: () => getCharacters(),
      staleTime: WUWA_BUILDS_STALE_TIME,
      gcTime: WUWA_BUILDS_GC_TIME,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: wuwaBuildsKeys.character(id),
      queryFn: () => getCharacter({ data: { id } }),
      staleTime: WUWA_BUILDS_STALE_TIME,
      gcTime: WUWA_BUILDS_GC_TIME,
    }),
}
