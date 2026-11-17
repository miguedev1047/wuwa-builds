import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import {
  parseAsString,
  parseAsInteger,
  parseAsBoolean,
  parseAsStringEnum,
} from "nuqs"
import { createSearchFilters } from "@/hooks/create-search-filters"

const useFilters = createSearchFilters({
  search: parseAsString.withDefault(""),
  rarity: parseAsInteger,
  page: parseAsInteger.withDefault(0),
  enabled: parseAsBoolean.withDefault(false),
  element: parseAsStringEnum(["fusion", "aero"]),
})

/** Reads the real nuqs hook under its supported testing adapter. */
function readFilters(searchParams: string, scope: string) {
  let observed: ReturnType<typeof useFilters> | undefined
  function Probe() {
    observed = useFilters({ scope })
    return null
  }
  renderToStaticMarkup(
    <NuqsTestingAdapter searchParams={searchParams}>
      <Probe />
    </NuqsTestingAdapter>
  )
  if (!observed) throw new Error("Filters did not render")
  return observed
}

describe("search filter factory", () => {
  test("restores parser defaults without marking them active", () => {
    const state = readFilters("", "admin_resonators")
    expect(state.values).toEqual({
      search: "",
      rarity: null,
      page: 0,
      enabled: false,
      element: null,
    })
    expect(state.hasActiveFilters).toBe(false)
  })

  test("reads only its scope, including valid zero values", () => {
    const query =
      "?admin_resonators.search=Mortefi&admin_resonators.rarity=0&builder_resonators.search=Yangyang"
    const admin = readFilters(query, "admin_resonators")
    const builder = readFilters(query, "builder_resonators")
    expect(admin.values.search).toBe("Mortefi")
    expect(admin.values.rarity).toBe(0)
    expect(builder.values.search).toBe("Yangyang")
    expect(builder.values.rarity).toBeNull()
    expect(admin.hasActiveFilters).toBe(true)
  })

  test("rejects invalid URL values through their configured parser", () => {
    const state = readFilters(
      "?search.element=Fusión&search.rarity=nope",
      "search"
    )
    expect(state.values.element).toBeNull()
    expect(state.values.rarity).toBeNull()
    expect(state.hasActiveFilters).toBe(false)
  })

  test("does not consider explicitly serialized defaults active", () => {
    const state = readFilters(
      "?search.page=0&search.enabled=false&search.search=",
      "search"
    )
    expect(state.hasActiveFilters).toBe(false)
  })
})
