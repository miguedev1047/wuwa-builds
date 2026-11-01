import type { ResonatorPassiveRow } from "@/db/schema"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Show } from "@/components/utility/show"
import { ResonatorPassiveDeleteAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/passives/components/resonator-passive-delete-action"
import { ResonatorPassiveEditAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/passives/components/resonator-passive-edit-action"

type ResonatorPassiveCardProps = {
  passive: ResonatorPassiveRow
  resonatorId: number
}

/** Card of one resonator passive with its description collapsed. */
export function ResonatorPassiveCard({
  passive,
  resonatorId,
}: ResonatorPassiveCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <Show when={passive.icon}>
            {(icon) => (
              <div className="size-10 shrink-0 overflow-hidden rounded-md bg-accent">
                <img
                  src={icon}
                  alt={passive.title}
                  className="size-full object-cover"
                />
              </div>
            )}
          </Show>

          <div className="flex min-w-0 flex-col gap-1">
            <CardTitle className="truncate">{passive.title}</CardTitle>
            <CardDescription>Pasiva</CardDescription>
          </div>
        </div>

        <CardAction className="flex items-center gap-1">
          <ResonatorPassiveEditAction passive={passive} />
          <ResonatorPassiveDeleteAction
            passiveId={passive.id}
            resonatorId={resonatorId}
          />
        </CardAction>
      </CardHeader>

      <CardContent>
        <Show when={passive.description}>
          {(description) => (
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
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </CollapsibleContent>
            </Collapsible>
          )}
        </Show>
      </CardContent>
    </Card>
  )
}
