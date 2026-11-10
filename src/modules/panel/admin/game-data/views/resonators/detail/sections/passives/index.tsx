import { useParams } from "@tanstack/react-router"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { ResonatorPassiveAddLoader } from "@panel/admin/game-data/views/resonators/detail/sections/passives/components/resonator-passive-add-loader"
import { ResonatorPassivesContent } from "@panel/admin/game-data/views/resonators/detail/sections/passives/components/resonator-passives-content"
import { ResonatorPassivesSkeleton } from "@panel/admin/game-data/views/resonators/detail/sections/passives/components/resonator-passives-skeleton"

/** Passives (`resonator_passives`) of the resonator. */
export function ResonatorPassivesSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Pasivas</EditableSection.Title>
        <EditableSection.Description>
          Pasivas del resonador y sus descripciones.
        </EditableSection.Description>

        <EditableSection.Action>
          <SkeletonSuspense skeleton={<SkeletonBox width="9rem" height={32} />}>
            <ResonatorPassiveAddLoader resonatorId={resonatorId} />
          </SkeletonSuspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <SkeletonSuspense skeleton={<ResonatorPassivesSkeleton />}>
        <ResonatorPassivesContent resonatorId={resonatorId} />
      </SkeletonSuspense>
    </EditableSection.Root>
  )
}
