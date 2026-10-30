import { Show } from "@/components/utility/show"
import type { ResonatorRow } from "@/db/schema"
import { cn } from "cn"

export function ResonatorItem({ character }: { character: ResonatorRow }) {
  return (
    <li role="button" className={cn("aspect-2/3 overflow-hidden")}>
      <Show when={character.iconLarge}>
        {(image) => (
          <img
            className="size-full object-cover transition-transform ease-in-out hover:scale-120"
            src={image}
          />
        )}
      </Show>
    </li>
  )
}
