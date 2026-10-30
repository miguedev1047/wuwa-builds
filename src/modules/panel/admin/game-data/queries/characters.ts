import {
  getCharacter,
  getCharacters,
} from "@/modules/panel/admin/game-data/server/characters"
import { queryOptions } from "@tanstack/react-query"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import {
  WUWA_BUILDS_GC_TIME,
  WUWA_BUILDS_STALE_TIME,
} from "@/modules/panel/admin/game-data/queries/cache"

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
