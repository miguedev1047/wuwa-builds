import { useParams } from "@tanstack/react-router"
import { SkeletonSuspense } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { ResonatorMediaContent } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/media/components/resonator-media-content"
import { ResonatorMediaSkeleton } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/media/components/resonator-media-skeleton"

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

      <SkeletonSuspense skeleton={<ResonatorMediaSkeleton />}>
        <ResonatorMediaContent resonatorId={resonatorId} />
      </SkeletonSuspense>
    </EditableSection.Root>
  )
}
