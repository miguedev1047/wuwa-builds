import { useSuspenseQuery } from "@tanstack/react-query"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { characterQueries } from "@catalog/queries/characters"
import { ResonatorMediaItem } from "@catalog/presentation/resonators/detail/sections/media/components/resonator-media-item"

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
