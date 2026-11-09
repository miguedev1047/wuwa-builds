import { useSuspenseQuery } from "@tanstack/react-query"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { ResonatorMediaItem } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/media/components/resonator-media-item"

type ResonatorMediaContentProps = {
  resonatorId: number
}

/** Suspended list of the resonator images. */
export function ResonatorMediaContent({
  resonatorId,
}: ResonatorMediaContentProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  return (
    <EditableSection.Content>
      <EditableSection.List
        items={resonator.media}
        getItemKey={(media) => media.id}
        empty={
          <EditableSection.Text>Sin imágenes registradas.</EditableSection.Text>
        }
      >
        {(media) => <ResonatorMediaItem media={media} />}
      </EditableSection.List>
    </EditableSection.Content>
  )
}
