import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorPassiveAddLoader } from "@catalog/presentation/resonators/detail/sections/passives/components/resonator-passive-add-loader"
import { ResonatorPassivesContent } from "@catalog/presentation/resonators/detail/sections/passives/components/resonator-passives-content"
import { ResonatorPassivesSkeleton } from "@catalog/presentation/resonators/detail/sections/passives/components/resonator-passives-skeleton"
import { Suspense } from "react"

/** Passives (`resonator_passives`) of the resonator. */
export function ResonatorPassivesSection({
  resonatorId,
}: {
  resonatorId: number
}) {
  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Pasivas</EditableSection.Title>
        <EditableSection.Description>
          Pasivas del resonador y sus descripciones.
        </EditableSection.Description>

        <EditableSection.Actions>
          <Suspense fallback={<Skeleton className="h-8 w-36" />}>
            <ResonatorPassiveAddLoader resonatorId={resonatorId} />
          </Suspense>
        </EditableSection.Actions>
      </EditableSection.Header>

      <Suspense fallback={<ResonatorPassivesSkeleton />}>
        <ResonatorPassivesContent resonatorId={resonatorId} />
      </Suspense>
    </EditableSection.Root>
  )
}
