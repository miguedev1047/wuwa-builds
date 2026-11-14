import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Show } from "@/components/utility/show"
import type { EchoSetRow, SonataSetEffectRow } from "@db/schema"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { EchoSetDeleteAction } from "@catalog/presentation/echoes/detail/sections/sets/components/echo-set-delete-action"
import { SonataCardContent } from "@catalog/presentation/echoes/detail/sections/sets/components/sonata-card-content"

type EchoSetCardProps = {
  echoId: number
  echoSet: EchoSetRow & {
    sonataEffects: SonataSetEffectRow[]
  }
}

/** One sonata set linked to the echo, with a hover preview of its effects. */
export function EchoSetCard({ echoSet, echoId }: EchoSetCardProps) {
  return (
    <HoverCard>
      <EditableSection.Item>
        <Show when={echoSet.icon}>
          {(icon) => (
            <HoverCardTrigger
              render={
                <EditableSection.ItemMedia className="size-10 rounded-md">
                  <EditableSection.Image
                    src={icon}
                    alt={echoSet.name}
                    className="object-contain p-1"
                  />
                </EditableSection.ItemMedia>
              }
            />
          )}
        </Show>

        <EditableSection.ItemContent>
          <HoverCardTrigger
            render={
              <EditableSection.ItemTitle>
                {echoSet.name}
              </EditableSection.ItemTitle>
            }
          />
        </EditableSection.ItemContent>

        <EditableSection.ItemActions>
          <EchoSetDeleteAction echoId={echoId} echoSet={echoSet} />
        </EditableSection.ItemActions>
      </EditableSection.Item>

      <HoverCardContent className="w-full max-w-150" align="start">
        <SonataCardContent echoSet={echoSet} />
      </HoverCardContent>
    </HoverCard>
  )
}
