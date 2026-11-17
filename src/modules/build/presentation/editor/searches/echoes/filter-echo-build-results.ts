import type { EchoSelectionSummary } from "@catalog/domain/echo"
import type { EchoBuildFilters } from "@build/presentation/editor/searches/echoes/hooks/use-echo-build-filters"

/** Narrows this source's list and preserves its original objects. */
export function filterEchoBuildResults({
  items,
  filters,
}: {
  items: readonly EchoSelectionSummary[]
  filters: EchoBuildFilters
}): EchoSelectionSummary[] {
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
        item.sets.some((set) => set.setId === filters.sonataId))
    )
  })
}

/** Uses sonatas from this search's unfiltered source, not another catalog. */
export function echoBuildSonataOptions(items: readonly EchoSelectionSummary[]) {
  const options = new Map<number, { label: string; icon: string }>()
  for (const item of items)
    for (const set of item.sets)
      options.set(set.setId, { label: set.name, icon: set.icon })
  return Array.from(options, ([value, option]) => ({ value, ...option })).sort(
    (a, b) => a.label.localeCompare(b.label)
  )
}
