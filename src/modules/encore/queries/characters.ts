import { queryOptions } from "@tanstack/react-query"
import { getCharacter, getCharacters } from "../server/characters"
import { ENCORE_GC_TIME, ENCORE_STALE_TIME } from "./cache"
import { encoreKeys } from "./keys"

export const characterQueries = {
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
