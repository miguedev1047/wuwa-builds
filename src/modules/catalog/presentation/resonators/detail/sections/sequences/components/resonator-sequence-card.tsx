import { Button } from "@/components/panelui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Show } from "@/components/utility/show"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorSequenceDeleteAction } from "@catalog/presentation/resonators/detail/sections/sequences/components/resonator-sequence-delete-action"
import { ResonatorSequenceEditAction } from "@catalog/presentation/resonators/detail/sections/sequences/components/resonator-sequence-edit-action"
import type { ResonatorSequenceRow } from "@db/schema"
import { ChevronDownIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
              <Button variant="secondary" className="w-full">
                Ver descripción
                <HugeiconsIcon icon={ChevronDownIcon} className="ml-auto" />
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
