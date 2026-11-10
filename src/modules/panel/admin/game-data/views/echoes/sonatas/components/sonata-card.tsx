import { Badge } from "@/components/ui/badge"
import { Show } from "@/components/utility/show"
import type { SonataSetEffectRow, SonataSetRow } from "@db/schema"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { SonataDeleteAction } from "@panel/admin/game-data/views/echoes/sonatas/components/sonata-delete-action"
import { SonataEditAction } from "@panel/admin/game-data/views/echoes/sonatas/components/sonata-edit-action"

type SonataWithEffects = SonataSetRow & { effects: SonataSetEffectRow[] }

type SonataCardProps = {
  sonata: SonataWithEffects
}

/** One sonata set with its piece thresholds and their curated stats. */
export function SonataCard({ sonata }: SonataCardProps) {
  return (
    <EditableSection.Card>
      <EditableSection.CardHeader>
        <div className="flex items-center gap-2">
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
          <div>
            <EditableSection.CardTitle>{sonata.name}</EditableSection.CardTitle>
            <div className="flex flex-wrap items-center gap-1">
              {sonata.effects.map((effect) => (
                <Badge key={effect.id} variant="secondary">
                  {effect.pieces} {effect.pieces === 1 ? "pieza" : "piezas"}
                </Badge>
              ))}
              <Badge variant="secondary">
                {sonata.source === "manual" ? "Manual" : "Encore"}
              </Badge>
            </div>
          </div>
        </div>
        <EditableSection.CardAction>
          <SonataEditAction sonata={sonata} />
          <SonataDeleteAction sonata={sonata} />
        </EditableSection.CardAction>
      </EditableSection.CardHeader>

      <EditableSection.CardContent>
        <EditableSection.CardDescription className="space-y-1">
          {sonata.effects.map((effect) => (
            <span key={effect.id} className="block">
              <span className="font-medium text-foreground">
                {effect.pieces}p:
              </span>{" "}
              {effect.description}
            </span>
          ))}
        </EditableSection.CardDescription>
      </EditableSection.CardContent>
    </EditableSection.Card>
  )
}
