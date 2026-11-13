import { useParams } from "@tanstack/react-router"
import { Suspense } from "react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { ResonatorMediaContent } from "@panel/admin/game-data/views/resonators/detail/sections/media/components/resonator-media-content"
import { ResonatorMediaSkeleton } from "@panel/admin/game-data/views/resonators/detail/sections/media/components/resonator-media-skeleton"

/** Images (`resonators_media`) of the resonator. */
export function ResonatorMediaSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Imagenes</EditableSection.Title>
        <EditableSection.Description>
          Imágenes del resonador importadas desde Encore.
        </EditableSection.Description>
      </EditableSection.Header>

      <Suspense fallback={<ResonatorMediaSkeleton />}>
        <ResonatorMediaContent resonatorId={resonatorId} />
      </Suspense>
    </EditableSection.Root>
  )
}
