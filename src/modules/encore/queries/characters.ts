import { queryOptions } from "@tanstack/react-query"
import { getCharacter, getCharacters } from "@encore/server/characters"
import { ENCORE_GC_TIME, ENCORE_STALE_TIME } from "@encore/queries/cache"
import { encoreKeys } from "@encore/queries/keys"

export const encoreCharacterQueries = {
  list: () =>
    queryOptions({
      queryKey: encoreKeys.characters(),
      queryFn: () => getCharacters(),
      staleTime: ENCORE_STALE_TIME,
      gcTime: ENCORE_GC_TIME,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: encoreKeys.character(id),
      queryFn: () => getCharacter({ data: { id } }),
      staleTime: ENCORE_STALE_TIME,
      gcTime: ENCORE_GC_TIME,
    }),
}
