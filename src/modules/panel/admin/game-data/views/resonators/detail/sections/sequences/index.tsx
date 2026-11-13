import { useParams } from "@tanstack/react-router"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { ResonatorSequenceAddLoader } from "@panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequence-add-loader"
import { ResonatorSequencesContent } from "@panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequences-content"
import { ResonatorSequencesSkeleton } from "@panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequences-skeleton"
import { ResonatorSequenceSyncAction } from "@panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequence-sync-action"

/** Sequences (`resonator_sequences`) of the resonator. */
export function ResonatorSequencesSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Secuencias</EditableSection.Title>
        <EditableSection.Description>
          Secuencias del resonador y sus descripciones.
        </EditableSection.Description>

        <EditableSection.Action>
          <ResonatorSequenceSyncAction resonatorId={resonatorId} />

          <Suspense fallback={<Skeleton className="h-8 w-36" />}>
            <ResonatorSequenceAddLoader resonatorId={resonatorId} />
          </Suspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <Suspense fallback={<ResonatorSequencesSkeleton />}>
        <ResonatorSequencesContent resonatorId={resonatorId} />
      </Suspense>
    </EditableSection.Root>
  )
}
