import {
  getCharacter,
  getCharacters,
} from "@game-data/server/resonators/resonators"
import { queryOptions } from "@tanstack/react-query"
import { wuwaBuildsKeys } from "@game-data/queries/keys"
import {
  WUWA_BUILDS_GC_TIME,
  WUWA_BUILDS_STALE_TIME,
} from "@game-data/queries/cache"

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
