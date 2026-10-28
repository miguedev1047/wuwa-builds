import { Show } from "@/components/utility/show"
import { resonatorQueries } from "@/modules/wuwa/queries/resonators"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ResonatorItem } from "@/modules/panel/user/new-build/components/resonator-item"

export function ResonatorLists() {
  const { data: resonators } = useSuspenseQuery(resonatorQueries.index())

  return (
    <ul className="grid grid-cols-5 gap-4">
      <Show when={resonators?.characters}>
        {(characters) =>
          characters.map((resonator) => (
            <ResonatorItem key={resonator.slug} resonator={resonator} />
          ))
        }
      </Show>
    </ul>
  )
}
