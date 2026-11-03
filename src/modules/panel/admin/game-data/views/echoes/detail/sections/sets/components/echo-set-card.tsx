import {
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Show } from "@/components/utility/show"
import type { EchoSetRow } from "@/db/schema"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { EchoSetDeleteAction } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/sets/components/echo-set-delete-action"

type EchoSetCardProps = {
  echoSet: EchoSetRow
}

/** One sonata set already linked to the echo. */
export function EchoSetCard({ echoSet }: EchoSetCardProps) {
  return (
    <EditableSection.Item>
      <Show when={echoSet.icon}>
        {(icon) => (
          <EditableSection.ItemMedia className="size-10 rounded-md">
            <EditableSection.Image
              src={icon}
              alt={echoSet.name}
              className="object-contain p-1"
            />
          </EditableSection.ItemMedia>
        )}
      </Show>

      <ItemContent>
        <ItemTitle>{echoSet.name}</ItemTitle>
        <ItemDescription>Set {echoSet.setId}</ItemDescription>
      </ItemContent>

      <ItemActions>
        <EchoSetDeleteAction echoSet={echoSet} />
      </ItemActions>
    </EditableSection.Item>
  )
}
