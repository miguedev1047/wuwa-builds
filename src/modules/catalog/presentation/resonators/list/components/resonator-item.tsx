import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Show } from "@/components/utility/show"
import type { ResonatorRow } from "@db/schema"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"

export function ResonatorItem({ character }: { character: ResonatorRow }) {
  const { DetailLink } = useCatalogActions()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <DetailLink id={character.id}>
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
          </DetailLink>
        }
      />
      <TooltipContent>{character.name}</TooltipContent>
    </Tooltip>
  )
}
