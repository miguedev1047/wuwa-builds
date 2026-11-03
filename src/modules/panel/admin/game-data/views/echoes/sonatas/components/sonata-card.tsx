import { Badge } from "@/components/ui/badge"
import {
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import { Show } from "@/components/utility/show"
import type { SonataSetEffectRow, SonataSetRow } from "@/db/schema"
import { statLabel } from "@/modules/panel/admin/game-data/application/stats/stats"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { SonataDeleteAction } from "@/modules/panel/admin/game-data/views/echoes/sonatas/components/sonata-delete-action"
import { SonataEditAction } from "@/modules/panel/admin/game-data/views/echoes/sonatas/components/sonata-edit-action"

type SonataWithEffects = SonataSetRow & { effects: SonataSetEffectRow[] }

type SonataCardProps = {
  sonata: SonataWithEffects
}

/** One sonata set with its piece thresholds and their curated stats. */
export function SonataCard({ sonata }: SonataCardProps) {
  return (
    <EditableSection.Item>
      <Show when={sonata.icon}>
        {(icon) => (
          <EditableSection.ItemMedia className="size-10 rounded-md">
            <EditableSection.Image
              src={icon}
              alt={sonata.name}
              className="object-contain p-1"
            />
          </EditableSection.ItemMedia>
        )}
      </Show>

      <ItemContent>
        <ItemHeader>
          <ItemTitle>{sonata.name}</ItemTitle>
        </ItemHeader>

        <div className="flex flex-wrap items-center gap-1">
          {sonata.effects.map((effect) => (
            <Badge key={effect.id} variant="outline">
              {effect.pieces} {effect.pieces === 1 ? "pieza" : "piezas"}
            </Badge>
          ))}
          <Badge variant="secondary">
            {sonata.source === "manual" ? "Manual" : "Encore"}
          </Badge>
        </div>

        <ItemDescription className="space-y-1">
          {sonata.effects.map((effect) => (
            <span key={effect.id} className="block">
              <span className="font-medium text-foreground">
                {effect.pieces}p:
              </span>{" "}
              {effect.description}
              <Show when={!effect.isConditional && effect.statId}>
                {(statId) => (
                  <Badge variant="ghost" className="ml-2">
                    {statLabel(statId)}
                    {effect.value === null ? "" : ` ${effect.value}%`}
                  </Badge>
                )}
              </Show>
            </span>
          ))}
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        <SonataEditAction sonata={sonata} />
        <SonataDeleteAction sonata={sonata} />
      </ItemActions>
    </EditableSection.Item>
  )
}
