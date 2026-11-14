import type { ResonatorPassiveRow } from "@db/schema"
import { Show } from "@/components/utility/show"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorPassiveDeleteAction } from "@catalog/presentation/resonators/detail/sections/passives/components/resonator-passive-delete-action"
import { ResonatorPassiveEditAction } from "@catalog/presentation/resonators/detail/sections/passives/components/resonator-passive-edit-action"

type ResonatorPassiveCardProps = {
  passive: ResonatorPassiveRow
  resonatorId: number
}

/** Row of one resonator passive with its numeric value. */
export function ResonatorPassiveCard({
  passive,
  resonatorId,
}: ResonatorPassiveCardProps) {
  return (
    <EditableSection.Item>
      <EditableSection.Media variant="image">
        <Show when={passive.icon}>
          {(icon) => <EditableSection.Image src={icon} alt={passive.title} />}
        </Show>
      </EditableSection.Media>
      <EditableSection.ItemContent>
        <EditableSection.ItemTitle className="truncate">
          {passive.title}
        </EditableSection.ItemTitle>
        <EditableSection.ItemDescription>
          Valor: {passive.valueNumber}
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
