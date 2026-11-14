import { Suspense } from "react"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorMediaContent } from "@catalog/presentation/resonators/detail/sections/media/components/resonator-media-content"
import { ResonatorMediaSkeleton } from "@catalog/presentation/resonators/detail/sections/media/components/resonator-media-skeleton"

/** Images (`resonators_media`) of the resonator. */
export function ResonatorMediaSection({
  resonatorId,
}: {
  resonatorId: number
}) {
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
