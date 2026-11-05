import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { Show } from "@/components/utility/show"
import type { EchoSetRow, SonataSetEffectRow } from "@/db/schema"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { EchoSetDeleteAction } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/sets/components/echo-set-delete-action"
import { SonataCardContent } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/sets/components/sonata-card-content"

type EchoSetCardProps = {
  echoSet: EchoSetRow & {
    sonataEffects: SonataSetEffectRow[]
  }
}

/** One sonata set already linked to the echo. */
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

        <ItemContent>
          <HoverCardTrigger render={<ItemTitle>{echoSet.name}</ItemTitle>} />
        </ItemContent>

        <ItemActions>
          <EchoSetDeleteAction echoSet={echoSet} />
        </ItemActions>
      </EditableSection.Item>

      <HoverCardContent className="w-full max-w-150" align="start">
        <SonataCardContent echoSet={echoSet} />
      </HoverCardContent>
    </HoverCard>
  )
}
