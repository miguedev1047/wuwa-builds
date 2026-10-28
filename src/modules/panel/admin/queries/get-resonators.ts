import { queryOptions } from "@tanstack/react-query"
import { resonatorKeys } from "@/modules/wuwa/queries/keys"
import { getResonator, getResonators } from "@/modules/wuwa/server/resonators"

export const getResonatorsQueryOpts = queryOptions({
  queryKey: resonatorKeys.index(),
  queryFn: () => getResonators(),
})

export const getResonatorQueryOpts = (slug: string) =>
  queryOptions({
    queryKey: resonatorKeys.detail(slug),
    queryFn: () => getResonator({ data: { slug } }),
  })
