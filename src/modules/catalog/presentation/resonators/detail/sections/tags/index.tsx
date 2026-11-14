import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorTagsContent } from "@catalog/presentation/resonators/detail/sections/tags/components/resonator-tags-content"
import { ResonatorTagsEditLoader } from "@catalog/presentation/resonators/detail/sections/tags/components/resonator-tags-edit-loader"
import { ResonatorTagsSkeleton } from "@catalog/presentation/resonators/detail/sections/tags/components/resonator-tags-skeleton"

/** Tags (`resonator_tags`) of the resonator. */
export function ResonatorTagsSection({ resonatorId }: { resonatorId: number }) {
  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Etiquetas</EditableSection.Title>
        <EditableSection.Description>
          Estilos de combate del resonador.
        </EditableSection.Description>

        <EditableSection.Action>
          <Suspense fallback={<Skeleton className="h-8 w-24" />}>
            <ResonatorTagsEditLoader resonatorId={resonatorId} />
          </Suspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <Suspense fallback={<ResonatorTagsSkeleton />}>
        <ResonatorTagsContent resonatorId={resonatorId} />
      </Suspense>
    </EditableSection.Root>
  )
}
