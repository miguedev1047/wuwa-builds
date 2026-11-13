import { useParams } from "@tanstack/react-router"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { PropertyLevelAddLoader } from "@panel/admin/game-data/views/resonators/detail/sections/levels/components/property-level-add-loader"
import { PropertyLevelsList } from "@panel/admin/game-data/views/resonators/detail/sections/levels/components/property-levels-list"
import { PropertyLevelsSkeleton } from "@panel/admin/game-data/views/resonators/detail/sections/levels/components/property-levels-skeleton"

/** Properties (`resonator_property_levels`) of the resonator. */
export function ResonatorLevelsSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Niveles</EditableSection.Title>
        <EditableSection.Description>
          Propiedades base del resonador y sus valores por nivel.
        </EditableSection.Description>

        <EditableSection.Action>
          <Suspense fallback={<Skeleton className="h-8 w-24" />}>
            <PropertyLevelAddLoader resonatorId={resonatorId} />
          </Suspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <Suspense fallback={<PropertyLevelsSkeleton />}>
        <PropertyLevelsList resonatorId={resonatorId} />
      </Suspense>
    </EditableSection.Root>
  )
}
