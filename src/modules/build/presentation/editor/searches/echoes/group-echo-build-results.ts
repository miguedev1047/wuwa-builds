import { ECHO_COST_OPTIONS } from "@/modules/game-data/domain/categories"
import type { EchoSelectionSummary } from "@catalog/domain/echo"

export const echoBuildCostOptions = [...ECHO_COST_OPTIONS].reverse()

/** Groups matching echoes by descending cost, preserving their order within each group. */
export function groupEchoBuildResults(items: readonly EchoSelectionSummary[]) {
  const byCost = new Map<number, EchoSelectionSummary[]>()

  for (const item of items) {
    const group = byCost.get(item.cost)
    if (group) group.push(item)
    else byCost.set(item.cost, [item])
  }

  return echoBuildCostOptions.flatMap(({ value, label }) => {
    const items = byCost.get(value)
    return items ? [{ cost: value, label, items }] : []
  })
}
