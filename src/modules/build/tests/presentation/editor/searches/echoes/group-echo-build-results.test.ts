import { expect, test } from "bun:test"
import { filterEchoBuildResults } from "@build/presentation/editor/searches/echoes/filter-echo-build-results"
import { groupEchoBuildResults } from "@build/presentation/editor/searches/echoes/group-echo-build-results"
import { echoSummary } from "@build/tests/fixtures/catalog-fixtures"

test("groups matching echoes by descending cost and skips empty groups", () => {
  const common = { ...echoSummary({ id: 1, cost: 1 }), sets: [] }
  const elite = { ...echoSummary({ id: 2, cost: 3 }), sets: [] }
  const firstBoss = { ...echoSummary({ id: 3, cost: 4 }), sets: [] }
  const secondBoss = { ...echoSummary({ id: 4, cost: 4 }), sets: [] }
  const items = [common, firstBoss, elite, secondBoss]

  expect(groupEchoBuildResults(items)).toEqual([
    { cost: 4, label: "Coste 4", items: [firstBoss, secondBoss] },
    { cost: 3, label: "Coste 3", items: [elite] },
    { cost: 1, label: "Coste 1", items: [common] },
  ])
  expect(
    groupEchoBuildResults(
      filterEchoBuildResults({
        items,
        filters: { search: "", cost: 3, class: null, sonataId: null },
      })
    )
  ).toEqual([{ cost: 3, label: "Coste 3", items: [elite] }])
  expect(groupEchoBuildResults([])).toEqual([])
})
