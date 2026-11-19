import { Tooltip } from "@/components/panelui/tooltip"
import { Badge } from "@/components/panelui/badge"
import { Show } from "@/components/utility/show"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import type { ResonatorRow } from "@db/schema"
import { cn } from "cn"

type ResonatorItemProps = {
  character: ResonatorRow
}

type ResonatorStatusItemProps = {
  character: ResonatorRow
}

/** Curation status badges pinned over one resonator portrait. */
function ResonatorStatusItem({ character }: ResonatorStatusItemProps) {
  return (
    <div className="pointer-events-none absolute top-1.5 left-1.5 z-10 flex flex-wrap gap-1">
      <Show when={!character.isVisible}>
        <Badge variant="outline" className="bg-background/80">
          Oculto
        </Badge>
      </Show>
      <Show when={character.isNew}>
        <Badge className="bg-primary text-primary-foreground">Nuevo</Badge>
      </Show>
      <Show when={character.isCollab}>
        <Badge variant="outline" className="bg-background/80">
          Colab
        </Badge>
      </Show>
    </div>
  )
}

export function ResonatorItem({ character }: ResonatorItemProps) {
  const { DetailLink } = useCatalogActions()

  return (
    <Tooltip>
      <Tooltip.Trigger
        render={
          <DetailLink id={character.id}>
            <span className={cn("relative block size-full")}>
              <ResonatorStatusItem character={character} />
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
            </span>
          </DetailLink>
        }
      />
      <Tooltip.Content>{character.name}</Tooltip.Content>
    </Tooltip>
  )
}
