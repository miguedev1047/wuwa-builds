import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorBestSetsContent } from "@catalog/presentation/resonators/detail/sections/best-sets/components/resonator-best-sets-content"
import { ResonatorBestSetsEditLoader } from "@catalog/presentation/resonators/detail/sections/best-sets/components/resonator-best-sets-edit-loader"
import { ResonatorBestSetsSkeleton } from "@catalog/presentation/resonators/detail/sections/best-sets/components/resonator-best-sets-skeleton"
import { Suspense } from "react"

/** Ordered recommended Sonata sets for a resonator. */
export function ResonatorBestSetsSection({
  resonatorId,
}: {
  resonatorId: number
}) {
  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Mejores sets de Sonata</EditableSection.Title>
        <EditableSection.Description>
          Sets recomendados en orden de prioridad.
        </EditableSection.Description>
        <EditableSection.Actions>
          <Suspense fallback={<Skeleton className="h-8 w-24" />}>
            <ResonatorBestSetsEditLoader resonatorId={resonatorId} />
          </Suspense>
        </EditableSection.Actions>
      </EditableSection.Header>
      <Suspense fallback={<ResonatorBestSetsSkeleton />}>
        <ResonatorBestSetsContent resonatorId={resonatorId} />
      </Suspense>
    </EditableSection.Root>
  )
}
