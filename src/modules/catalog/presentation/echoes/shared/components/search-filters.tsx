import { echoClassSchema } from "@/modules/game-data/domain/categories"
import { QuerySelect } from "@/components/blocks/query-select"
import { Show } from "@/components/utility/show"
import { sonataQueries } from "@/modules/catalog/queries/sonatas"
import {
  ECHO_CLASS_OPTIONS,
  ECHO_COST_OPTIONS,
} from "@catalog/presentation/echoes/shared/constants/echo"
import { useEchoSearchParams } from "@catalog/presentation/echoes/shared/hooks/use-echo-search-params"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

/** Filter controls used by the echo picker. */
export function EchoSearchFilters() {
  const { data: sonatas } = useQuery(sonataQueries.list())
  const {
    echoSet,
    echoCost,
    echoClass,
    setEchoSet,
    setEchoCost,
    setEchoClass,
  } = useEchoSearchParams()
  const sonataOptions = sonatas?.map((sonata) => ({
    label: sonata.name,
    value: sonata.id,
    icon: sonata.icon,
  }))

  return (
    <>
      <Show when={sonataOptions} fallback={<Skeleton className="h-8 w-full" />}>
        {(options) => (
          <QuerySelect
            placeholder="Filtrar por sonata"
            items={options}
            value={echoSet}
            onValueChange={(value) =>
              void setEchoSet(typeof value === "number" ? value : null)
            }
          />
        )}
      </Show>
      <QuerySelect
        placeholder="Filtrar por coste"
        items={ECHO_COST_OPTIONS}
        value={echoCost}
        onValueChange={(value) =>
          void setEchoCost(typeof value === "number" ? value : null)
        }
      />
      <QuerySelect
        placeholder="Filtrar por clase"
        items={ECHO_CLASS_OPTIONS}
        value={echoClass}
        onValueChange={(value) =>
          void setEchoClass(echoClassSchema.safeParse(value).data ?? null)
        }
      />
    </>
  )
}
