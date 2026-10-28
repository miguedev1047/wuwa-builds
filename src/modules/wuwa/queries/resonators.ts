import { queryOptions } from "@tanstack/react-query"
import { getResonator, getResonators } from "../server/resonators"
import { resonatorKeys } from "./keys"

/** Shared TanStack Query options for resonator data. */
export const resonatorQueries = {
  index: () =>
    queryOptions({
      queryKey: resonatorKeys.index(),
      queryFn: () => getResonators(),
    }),

  detail: (slug: string) =>
    queryOptions({
      queryKey: resonatorKeys.detail(slug),
      queryFn: () => getResonator({ data: { slug } }),
    }),
}
