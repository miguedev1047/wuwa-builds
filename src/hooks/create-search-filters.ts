import { useCallback, useMemo } from "react"
import { useQueryStates, type UseQueryStatesKeysMap, type UrlKeys } from "nuqs"

/** A namespace belongs to one search instance, such as a specific echo slot. */
type SearchFilterScope = { scope: string }

/** Creates a typed nuqs hook; queries, controls and predicates stay with each search. */
export function createSearchFilters<P extends UseQueryStatesKeysMap>(
  parsers: P
) {
  return function useSearchFilters({ scope }: SearchFilterScope) {
    const urlKeys = useMemo(
      () =>
        Object.fromEntries(
          Object.keys(parsers).map((key) => [key, `${scope}.${key}`])
        ) as UrlKeys<P>,
      [scope]
    )
    const [values, setValues] = useQueryStates(parsers, {
      urlKeys,
      history: "replace",
      shallow: true,
    })
    const reset = useCallback(() => setValues(null), [setValues])
    const hasActiveFilters = Object.entries(parsers).some(([key, parser]) => {
      const value = values[key]
      const defaultValue = parser.defaultValue ?? null
      if (value === null || defaultValue === null) return value !== defaultValue
      return !(parser.eq ?? Object.is)(value, defaultValue)
    })
    return { values, setValues, reset, hasActiveFilters }
  }
}
