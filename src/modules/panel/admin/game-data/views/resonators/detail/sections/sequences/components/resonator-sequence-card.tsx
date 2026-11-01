import type { ResonatorSequenceRow } from "@/db/schema"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ResonatorSequenceDeleteAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequence-delete-action"
import { ResonatorSequenceEditAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequence-edit-action"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

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
    <Card>
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent font-heading text-sm">
            {sequence.index}
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <CardTitle className="truncate">{sequence.name}</CardTitle>
            <CardDescription>Secuencia {sequence.index}</CardDescription>
          </div>
        </div>

        <CardAction className="flex items-center gap-1">
          <ResonatorSequenceEditAction sequence={sequence} />
          <ResonatorSequenceDeleteAction
            sequenceId={sequence.id}
            resonatorId={resonatorId}
          />
        </CardAction>
      </CardHeader>

      <CardContent>
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
      </CardContent>
    </Card>
  )
}
