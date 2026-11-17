import { QuerySelect } from "@/components/blocks/query-select"
import {
  ECHO_COST_OPTIONS,
  ECHO_CLASS_OPTIONS,
  echoClassSchema,
} from "@/modules/game-data/domain/categories"
import type { EchoBuildFilterState } from "@build/presentation/editor/searches/echoes/hooks/use-echo-build-filters"

/** Filter controls owned by this specific search. */
export function EchoBuildFilterFields({
  filters,
  sonataOptions,
}: {
  filters: EchoBuildFilterState
  sonataOptions: { value: number; label: string; icon: string }[]
}) {
  return (
    <>
      <QuerySelect
        placeholder="Filtrar por sonata"
        items={sonataOptions}
        value={filters.values.sonataId}
        onValueChange={(value) =>
          void filters.setValues({
            sonataId: typeof value === "number" ? value : null,
          })
        }
      />
      <QuerySelect
        placeholder="Filtrar por coste"
        items={ECHO_COST_OPTIONS}
        value={filters.values.cost}
        onValueChange={(value) =>
          void filters.setValues({
            cost: typeof value === "number" ? value : null,
          })
        }
      />
      <QuerySelect
        placeholder="Filtrar por clase"
        items={ECHO_CLASS_OPTIONS}
        value={filters.values.class}
        onValueChange={(value) =>
          void filters.setValues({
            class: echoClassSchema.safeParse(value).data ?? null,
          })
        }
      />
    </>
  )
}
