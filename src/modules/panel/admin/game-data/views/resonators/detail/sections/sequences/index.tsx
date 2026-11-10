import { useParams } from "@tanstack/react-router"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { ResonatorSequenceAddLoader } from "@panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequence-add-loader"
import { ResonatorSequencesContent } from "@panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequences-content"
import { ResonatorSequencesSkeleton } from "@panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequences-skeleton"

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
          <SkeletonSuspense skeleton={<SkeletonBox width="9rem" height={32} />}>
            <ResonatorSequenceAddLoader resonatorId={resonatorId} />
          </SkeletonSuspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <SkeletonSuspense skeleton={<ResonatorSequencesSkeleton />}>
        <ResonatorSequencesContent resonatorId={resonatorId} />
      </SkeletonSuspense>
    </EditableSection.Root>
  )
}
