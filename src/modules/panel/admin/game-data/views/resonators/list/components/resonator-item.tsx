import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Show } from "@/components/utility/show"
import type { ResonatorRow } from "@db/schema"
import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { Link } from "@tanstack/react-router"

export function ResonatorItem({ character }: { character: ResonatorRow }) {
  const resonatorId = character.id.toString()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link to="/admin/resonators/$id" params={{ id: resonatorId }}>
            <Show when={character.iconLarge}>
              {(icon) => (
                <CatalogSection.Image
                  src={icon}
                  alt={character.name}
                  hover="zoom"
                  fit="cover"
                  className="size-full"
                  aspect="portrait"
                  background="accent"
                />
              )}
            </Show>
          </Link>
        }
      />
      <TooltipContent>{character.name}</TooltipContent>
    </Tooltip>
  )
}
