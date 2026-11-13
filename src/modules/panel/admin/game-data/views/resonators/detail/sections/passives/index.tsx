import { useParams } from "@tanstack/react-router"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
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
          <Suspense fallback={<Skeleton className="h-8 w-36" />}>
            <ResonatorPassiveAddLoader resonatorId={resonatorId} />
          </Suspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <Suspense fallback={<ResonatorPassivesSkeleton />}>
        <ResonatorPassivesContent resonatorId={resonatorId} />
      </Suspense>
    </EditableSection.Root>
  )
}
