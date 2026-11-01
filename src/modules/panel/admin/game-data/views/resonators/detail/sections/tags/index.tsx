import { useParams } from "@tanstack/react-router"
import { SkeletonSuspense } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { ResonatorTagsContent } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/tags/components/resonator-tags-content"
import { ResonatorTagsSkeleton } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/tags/components/resonator-tags-skeleton"

export function ResonatorTagsSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Etiquetas</EditableSection.Title>
        <EditableSection.Description>
          En esta seccion puedes agregar estilos de combate del resonador
        </EditableSection.Description>
      </EditableSection.Header>

      <SkeletonSuspense skeleton={<ResonatorTagsSkeleton />}>
        <ResonatorTagsContent resonatorId={resonatorId} />
      </SkeletonSuspense>
    </EditableSection.Root>
  )
}
