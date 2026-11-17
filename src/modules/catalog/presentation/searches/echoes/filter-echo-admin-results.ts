import type { EncoreEchoSummary } from "@encore/domain/echo"
import type { EchoAdminFilters } from "@catalog/presentation/searches/echoes/hooks/use-echo-admin-filters"

/** Narrows this source's list and preserves its original objects. */
export function filterEchoAdminResults({
  items,
  filters,
}: {
  items: readonly EncoreEchoSummary[]
  filters: EchoAdminFilters
}): EncoreEchoSummary[] {
  const words = filters.search
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  return items.filter((item) => {
    const text = `${item.name} ${item.id}`.toLocaleLowerCase()
    return (
      words.every((word) => text.includes(word)) &&
      (filters.class === null || item.class === filters.class) &&
      (filters.cost === null || item.cost === filters.cost) &&
      (filters.sonataId === null ||
        item.sets.some((set) => set.id === filters.sonataId))
    )
  })
}

/** Uses sonatas from this search's unfiltered source, not another catalog. */
export function echoAdminSonataOptions(items: readonly EncoreEchoSummary[]) {
  const options = new Map<number, { label: string; icon: string }>()
  for (const item of items)
    for (const set of item.sets)
      options.set(set.id, { label: set.name, icon: set.icon })
  return Array.from(options, ([value, option]) => ({ value, ...option })).sort(
    (a, b) => a.label.localeCompare(b.label)
  )
}
