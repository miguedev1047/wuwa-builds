import type { ResonatorSequenceRow } from "@db/schema"
import { Button } from "@/components/ui/button"
import { Show } from "@/components/utility/show"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorSequenceDeleteAction } from "@catalog/presentation/resonators/detail/sections/sequences/components/resonator-sequence-delete-action"
import { ResonatorSequenceEditAction } from "@catalog/presentation/resonators/detail/sections/sequences/components/resonator-sequence-edit-action"

type ResonatorSequenceCardProps = {
  sequence: ResonatorSequenceRow
  resonatorId: number
}

/** Card of one resonator sequence. */
export function ResonatorSequenceCard({
  sequence,
  resonatorId,
}: ResonatorSequenceCardProps) {
  return (
    <EditableSection.Card>
      <EditableSection.CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <EditableSection.Media variant="image">
            <Show when={sequence.icon} fallback={sequence.index}>
              {(icon) => (
                <EditableSection.Image src={icon} alt={sequence.name} />
              )}
            </Show>
          </EditableSection.Media>

          <div className="flex min-w-0 flex-col gap-1">
            <EditableSection.CardTitle className="truncate">
              {sequence.name}
            </EditableSection.CardTitle>
            <EditableSection.CardDescription>
              Secuencia {sequence.index}
            </EditableSection.CardDescription>
          </div>
        </div>

        <EditableSection.CardAction className="flex items-center gap-1">
          <ResonatorSequenceEditAction sequence={sequence} />
          <ResonatorSequenceDeleteAction
            sequenceId={sequence.id}
            resonatorId={resonatorId}
          />
        </EditableSection.CardAction>
      </EditableSection.CardHeader>

      <EditableSection.CardContent>
        <Collapsible>
          <CollapsibleTrigger
            render={
              <Button variant="outline" className="w-full">
                Ver descripción
              </Button>
            }
          />
          <CollapsibleContent className="mt-4 px-2">
            <div
              className="text-xs/relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: sequence.description }}
            />
          </CollapsibleContent>
        </Collapsible>
      </EditableSection.CardContent>
    </EditableSection.Card>
  )
}
