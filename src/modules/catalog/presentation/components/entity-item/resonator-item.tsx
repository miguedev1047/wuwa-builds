import { Badge } from "@/components/panelui/badge"
import { Tooltip } from "@/components/panelui/tooltip"
import { Show } from "@/components/utility/show"
import { EntityItem } from "@catalog/presentation/components/entity-item/entity-item"
import { cn } from "cn"

/** Minimal resonator shape accepted by the item, from D1 or Encore. */
export type ResonatorItemData = {
  name: string
  icon: string
  iconLarge?: string
  isVisible?: boolean
  isNew?: boolean
  isCollab?: boolean
}

type ResonatorItemProps = {
  character: ResonatorItemData
  /** Hides the curation badges in compact contexts such as search rows. */
  showStatus?: boolean
  /** Uses the head icon instead of the portrait, for small rows. */
  compact?: boolean
  className?: string
}

/** Curation status badges pinned over one resonator portrait. */
function ResonatorStatusBadges({
  character,
}: {
  character: ResonatorItemData
}) {
  return (
    <div className="pointer-events-none absolute top-1.5 left-1.5 z-10 flex flex-wrap gap-1">
      <Show when={character.isVisible === false}>
        <Badge variant="outline" className="bg-background/80">
          Oculto
        </Badge>
      </Show>
      <Show when={character.isNew === true}>
        <Badge className="bg-primary text-primary-foreground">Nuevo</Badge>
      </Show>
      <Show when={character.isCollab === true}>
        <Badge variant="outline" className="bg-background/80">
          Colab
        </Badge>
      </Show>
    </div>
  )
}

/** Reusable resonator thumbnail used by catalog lists and searches. */
export function ResonatorItem({
  character,
  showStatus = true,
  compact = false,
  className,
}: ResonatorItemProps) {
  return (
    <Tooltip>
      <Tooltip.Trigger
        render={
          <EntityItem
            src={
              compact ? character.icon : character.iconLarge || character.icon
            }
            alt={character.name}
            aria-label={character.name}
            className={cn(className)}
          >
            <Show when={showStatus}>
              <ResonatorStatusBadges character={character} />
            </Show>
          </EntityItem>
        }
      />
      <Tooltip.Content>{character.name}</Tooltip.Content>
    </Tooltip>
  )
}
