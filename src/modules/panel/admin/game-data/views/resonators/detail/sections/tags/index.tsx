import { useParams } from "@tanstack/react-router"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { ResonatorTagsContent } from "@panel/admin/game-data/views/resonators/detail/sections/tags/components/resonator-tags-content"
import { ResonatorTagsEditLoader } from "@panel/admin/game-data/views/resonators/detail/sections/tags/components/resonator-tags-edit-loader"
import { ResonatorTagsSkeleton } from "@panel/admin/game-data/views/resonators/detail/sections/tags/components/resonator-tags-skeleton"

/** Tags (`resonator_tags`) of the resonator. */
export function ResonatorTagsSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Etiquetas</EditableSection.Title>
        <EditableSection.Description>
          Estilos de combate del resonador.
        </EditableSection.Description>

        <EditableSection.Action>
          <SkeletonSuspense skeleton={<SkeletonBox width="6rem" height={32} />}>
            <ResonatorTagsEditLoader resonatorId={resonatorId} />
          </SkeletonSuspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <SkeletonSuspense skeleton={<ResonatorTagsSkeleton />}>
        <ResonatorTagsContent resonatorId={resonatorId} />
      </SkeletonSuspense>
    </EditableSection.Root>
  )
}
