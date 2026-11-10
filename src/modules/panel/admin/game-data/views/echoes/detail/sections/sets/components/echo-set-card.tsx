import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Show } from "@/components/utility/show"
import type { EchoSetRow, SonataSetEffectRow } from "@db/schema"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { EchoSetDeleteAction } from "@panel/admin/game-data/views/echoes/detail/sections/sets/components/echo-set-delete-action"
import { SonataCardContent } from "@panel/admin/game-data/views/echoes/detail/sections/sets/components/sonata-card-content"

type EchoSetCardProps = {
  echoSet: EchoSetRow & {
    sonataEffects: SonataSetEffectRow[]
  }
}

/** One sonata set linked to the echo, with a hover preview of its effects. */
export function EchoSetCard({ echoSet }: EchoSetCardProps) {
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
          <EchoSetDeleteAction echoSet={echoSet} />
        </EditableSection.ItemActions>
      </EditableSection.Item>

      <HoverCardContent className="w-full max-w-150" align="start">
        <SonataCardContent echoSet={echoSet} />
      </HoverCardContent>
    </HoverCard>
  )
}
