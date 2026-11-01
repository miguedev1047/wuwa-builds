import { queryOptions } from "@tanstack/react-query"
import {
  WUWA_BUILDS_GC_TIME,
  WUWA_BUILDS_STALE_TIME,
} from "@/modules/panel/admin/game-data/queries/cache"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { getResonatorTags } from "@/modules/panel/admin/game-data/server/tags"

export const resonatorTagsQueries = {
  byResonator: (resonatorId: number) =>
    queryOptions({
      queryKey: wuwaBuildsKeys.characterTags(resonatorId),
      queryFn: () => getResonatorTags({ data: { id: resonatorId } }),
      staleTime: WUWA_BUILDS_STALE_TIME,
      gcTime: WUWA_BUILDS_GC_TIME,
    }),
}
