import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorBestWeaponsContent } from "@catalog/presentation/resonators/detail/sections/best-weapons/components/resonator-best-weapons-content"
import { ResonatorBestWeaponsEditLoader } from "@catalog/presentation/resonators/detail/sections/best-weapons/components/resonator-best-weapons-edit-loader"
import { ResonatorBestWeaponsSkeleton } from "@catalog/presentation/resonators/detail/sections/best-weapons/components/resonator-best-weapons-skeleton"
import { Suspense } from "react"

/** Ordered recommended catalog weapons for a resonator. */
export function ResonatorBestWeaponsSection({
  resonatorId,
}: {
  resonatorId: number
}) {
  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Mejores armas</EditableSection.Title>
        <EditableSection.Description>
          Armas recomendadas en orden de prioridad.
        </EditableSection.Description>
        <EditableSection.Actions>
          <Suspense fallback={<Skeleton className="h-8 w-24" />}>
            <ResonatorBestWeaponsEditLoader resonatorId={resonatorId} />
          </Suspense>
        </EditableSection.Actions>
      </EditableSection.Header>
      <Suspense fallback={<ResonatorBestWeaponsSkeleton />}>
        <ResonatorBestWeaponsContent resonatorId={resonatorId} />
      </Suspense>
    </EditableSection.Root>
  )
}
