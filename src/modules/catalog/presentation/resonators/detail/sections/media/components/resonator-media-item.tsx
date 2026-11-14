import type { ResonatorMediaRow } from "@db/schema"
import { Show } from "@/components/utility/show"
import { resonatorMediaLabel } from "@catalog/application/constants/resonator"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorMediaEditAction } from "@catalog/presentation/resonators/detail/sections/media/components/resonator-media-edit-action"

type ResonatorMediaItemProps = {
  media: ResonatorMediaRow
}

/** Row of one resonator image with its edit action. */
export function ResonatorMediaItem({ media }: ResonatorMediaItemProps) {
  const label = resonatorMediaLabel(media.kind)

  return (
    <EditableSection.Item>
      <EditableSection.Media variant="image" size="lg" className="size-16">
        <Show when={media.url}>
          {(url) => <EditableSection.Image src={url} alt={label} />}
        </Show>
      </EditableSection.Media>

      <EditableSection.ItemContent>
        <EditableSection.ItemTitle>{label}</EditableSection.ItemTitle>
      </EditableSection.ItemContent>

      <EditableSection.ItemActions>
        <ResonatorMediaEditAction media={media} />
      </EditableSection.ItemActions>
    </EditableSection.Item>
  )
}
