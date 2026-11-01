import { useParams } from "@tanstack/react-router"
import { SkeletonSuspense } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { ResonatorTagsSkeleton } from "@/modules/panel/admin/game-data/views/resonators/detail/ui-states/tags-skeleton"
import { ResonatorTagsLoader } from "@/modules/panel/admin/game-data/views/resonators/detail/components/tags-form"

export function ResonatorTagsSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Etiquetas</EditableSection.Title>
        <EditableSection.Description>
          Se reemplazan al guardar; las opciones vienen del detalle de Encore.
        </EditableSection.Description>
      </EditableSection.Header>

      <SkeletonSuspense skeleton={<ResonatorTagsSkeleton />}>
        <ResonatorTagsLoader resonatorId={resonatorId} />
      </SkeletonSuspense>
    </EditableSection.Root>
  )
}
