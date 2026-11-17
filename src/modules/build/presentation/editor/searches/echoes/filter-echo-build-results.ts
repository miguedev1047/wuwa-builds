import type { EchoSelectionSummary } from "@catalog/domain/echo"
import type { EchoBuildFilters } from "@build/presentation/editor/searches/echoes/hooks/use-echo-build-filters"
import type { SonataCatalogEntry } from "@catalog/domain/sonata"

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

/** Uses every sonata set in the canonical catalog, including unlinked sets. */
export function echoBuildSonataOptions(
  sonatas: readonly Pick<SonataCatalogEntry, "id" | "name" | "icon">[]
) {
  return sonatas
    .map(({ id, name, icon }) => ({ value: id, label: name, icon }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
