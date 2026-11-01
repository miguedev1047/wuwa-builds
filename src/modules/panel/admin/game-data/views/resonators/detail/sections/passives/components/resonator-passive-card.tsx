import type { ResonatorPassiveRow } from "@/db/schema"
import { Show } from "@/components/utility/show"
import { ResonatorPassiveDeleteAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/passives/components/resonator-passive-delete-action"
import { ResonatorPassiveEditAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/passives/components/resonator-passive-edit-action"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { numberConverter } from "@/modules/panel/admin/game-data/views/resonators/detail/application/number-converter"

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
    <EditableSection.Item>
      <EditableSection.ItemMedia>
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
      </EditableSection.ItemMedia>
      <EditableSection.ItemContent>
        <EditableSection.ItemTitle className="truncate">
          {passive.title}
        </EditableSection.ItemTitle>
        <EditableSection.ItemDescription>
          {numberConverter({ input: passive.description })}
        </EditableSection.ItemDescription>
      </EditableSection.ItemContent>
      <EditableSection.ItemActions>
        <ResonatorPassiveEditAction passive={passive} />
        <ResonatorPassiveDeleteAction
          passiveId={passive.id}
          resonatorId={resonatorId}
        />
      </EditableSection.ItemActions>
    </EditableSection.Item>
  )
}
