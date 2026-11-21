# Integrating a search

The admin create forms, admin lists, and builder each have three independent
searches. Each owns its query, filters, controls,
result rows, trigger and selection behavior. Repeating small UI sections keeps
consumer-specific changes local.

| Entity     | Admin creation         | Admin list               | Builder                |
| ---------- | ---------------------- | ------------------------ | ---------------------- |
| Resonators | `ResonatorAdminSearch` | `ResonatorCatalogSearch` | `ResonatorBuildSearch` |
| Weapons    | `WeaponAdminSearch`    | `WeaponCatalogSearch`    | `WeaponBuildSearch`    |
| Echoes     | `EchoAdminSearch`      | `EchoCatalogSearch`      | `EchoBuildSearch`      |

Encore prefill searches live under
`src/modules/catalog/presentation/<entity>/new/search/`.
Admin list searches live beside each entity's list components. Builder searches
live under `src/modules/build/presentation/editor/searches/`. Admin lists and
the builder read the canonical D1 catalog. See the [builder guide](BUILDER_UI.md)
for build persistence rules.

## Folder structure

Each admin creation folder keeps its form and Encore search together:

```text
resonators/
  new/
    resonator-new.tsx
    components/
      resonator-form.tsx
    search/
      index.tsx
      filter-resonator-admin-results.ts
      hooks/
        use-resonator-admin-filters.ts
        use-resonator-admin-results.ts
      components/
        resonator-admin-filters.tsx
        resonator-admin-results.tsx
```

The builder equivalent uses `build` instead of `admin` in those names. Keep
components under 200 lines and extract private sections when needed. Do not
introduce a shared entity-search component, render-prop contract or query factory.

## Declare the filters

The only shared search factory is
[`createSearchFilters`](../src/hooks/create-search-filters.ts). Declare its parser
map outside render, in the search's own hook file:

```ts
import { createSearchFilters } from "@/hooks/create-search-filters"
import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs"
import {
  ELEMENT_IDS,
  WEAPON_TYPE_IDS,
} from "@/modules/game-data/domain/categories"

/** URL filters owned by the resonator admin search. */
export const useResonatorAdminFilters = createSearchFilters({
  search: parseAsString.withDefault(""),
  rarity: parseAsInteger,
  element: parseAsStringEnum(ELEMENT_IDS),
  weaponType: parseAsStringEnum(WEAPON_TYPE_IDS),
})

export type ResonatorAdminFilters = ReturnType<
  typeof useResonatorAdminFilters
>["values"]
```

Call that hook in the search component with an explicit scope:

```ts
const filters = useResonatorAdminFilters({ scope: "admin_resonators" })
```

This produces URL keys such as `admin_resonators.search` and
`admin_resonators.rarity`. The hook returns:

- `values`: typed values inferred from the parsers, including their defaults.
- `setValues`: nuqs updates for one or more fields, including functional updates.
- `reset`: removes only the keys declared by this hook in its current scope.
- `hasActiveFilters`: whether any value differs from its parser's default.

Updates use `history: "replace"` and `shallow: true`. Reset restores parser
defaults without clearing unrelated URL parameters. Nullable fields remain
`null` when absent. Zero and false are legitimate values, not automatically
inactive filters.

Use distinct scopes for admin and builder. Builder echo scopes also include the
slot index, for example `builder_echoes_0` and `builder_echoes_1`. Do not reuse one
scope for independent dialogs mounted on the same screen.

The factory does not accept queries, items, predicates, labels or field controls.

## Write controls inside the search

Render controls explicitly and update their field through `setValues`:

```tsx
<QuerySelect
  placeholder="Filtrar por rareza"
  items={RARITY_OPTIONS.slice(0, 2)}
  value={filters.values.rarity}
  onValueChange={(value) =>
    void filters.setValues({
      rarity: typeof value === "number" ? value : null,
    })
  }
/>
```

For category fields, validate the select value with the canonical schema before
updating it. See the [admin resonator controls](../src/modules/catalog/presentation/resonators/new/search/components/resonator-admin-filters.tsx).
A custom field belongs to that search and does not require changing the factory.

## Load and filter the source

Every search has its own results hook. The hook queries the known source and
passes the returned array plus filter values to a pure local helper:

```ts
import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreCharacterQueries } from "@encore/queries/characters"
import { filterResonatorAdminResults } from "@catalog/presentation/resonators/new/search/filter-resonator-admin-results"
import type { ResonatorAdminFilters } from "@catalog/presentation/resonators/new/search/hooks/use-resonator-admin-filters"

/** Loads and filters the admin's Encore source. */
export function useResonatorAdminResults(filters: ResonatorAdminFilters) {
  const { data } = useSuspenseQuery(encoreCharacterQueries.list())
  return {
    items: filterResonatorAdminResults({ items: data, filters }),
  }
}
```

The pure helper receives arrays, not query options or a React Query result. It
returns the original matching objects. Use the source's actual types rather than
casting catalog records to Encore records or introducing common search DTOs.

Builder has a separate hook using `characterQueries.list()`. If a future public
list differs from an admin list, give it its own server function, query options
and query key. Visibility and authorization belong on the server. UI filters
only narrow the list they receive.

Keep `useSuspenseQuery` in the results component's hook, under the dialog's
`Suspense` boundary. The trigger and text input remain available while results
load. Set `filter={false}` on `CommandSearch.Root` when the local helper already
performs text filtering.

## Control selection and closing locally

`CommandSearch` supplies UI primitives and does not interpret selection results.
Each search controls its own `open` state and calls `filters.reset()` when it
closes. The admin prefill and builder searches also clear their scope if they
unmount while open.

Every result item uses `closeOnSelect={false}`. The search handler decides when
to close and calls the caller's typed `onSelect`. Admin create forms receive the
Encore summary for prefill. Admin list screens receive the D1 record ID and open
its detail after the search clears its URL filters. Builder section components
apply the selected entry and return whether the action was accepted, including
an unchanged resonator. Failed or discarded actions leave the dialog open.

Builder resonator and weapon searches own their pending state and prevent
repeated selections. Their local request version prevents an older action from
closing a search that was closed and reopened while the action was pending.

Current implementations:

- [Admin resonators](../src/modules/catalog/presentation/resonators/new/search/index.tsx)
- [Admin weapons](../src/modules/catalog/presentation/weapons/new/search/index.tsx)
- [Admin echoes](../src/modules/catalog/presentation/echoes/new/search/index.tsx)
- [Builder resonators](../src/modules/build/presentation/editor/searches/resonators/index.tsx)
- [Builder weapons](../src/modules/build/presentation/editor/searches/weapons/index.tsx)
- [Builder echoes](../src/modules/build/presentation/editor/searches/echoes/index.tsx)

## Weapon and echo specifics

Weapon compatibility is part of `useWeaponBuildResults`, before user filters can
widen the result set. Admin weapons have their own filtering helper and do not
inherit that restriction. Both searches match name, id and the type label.

Builder echoes use `echoQueries.selection()`. It returns summaries plus
`sets: { setId, name, icon }[]`. Admin echoes use Encore summaries with sets containing
`id` and `name`. Each search derives its own sonata options from its unfiltered
source and uses its own field names directly.

Do not fetch a separate global sonata list or full details for every result. When
saving an echo to a build, pass only `EchoSummary` fields; search metadata is not
part of the saved snapshot. Editing catalog sonata associations must invalidate
both the echo detail and `wuwaBuildsKeys.echoesSelection()`.

## Verify an integration

Check the factory's parser inference, defaults and URL scope. Test pure helpers
with the actual source types, empty lists, combined filters and restricted
subsets. Check dialog reset, unrelated parameters, different echo slots,
selection failures and pending actions.

Run `bun run typecheck`, relevant tests and lint. Run build and Worker dry-run
checks when runtime code changes. No data migration is needed to reorganize a
search component.
