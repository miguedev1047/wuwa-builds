import { Tooltip } from "@/components/panelui/tooltip"
import { Show } from "@/components/utility/show"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import type { ResonatorRow } from "@db/schema"

export function ResonatorItem({ character }: { character: ResonatorRow }) {
  const { DetailLink } = useCatalogActions()

  return (
    <Tooltip>
      <Tooltip.Trigger
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
      <Tooltip.Content>{character.name}</Tooltip.Content>
    </Tooltip>
  )
}
