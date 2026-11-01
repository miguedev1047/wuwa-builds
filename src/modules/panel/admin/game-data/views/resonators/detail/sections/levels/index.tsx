import { useParams } from "@tanstack/react-router"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { PropertyLevelAddLoader } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/levels/components/property-level-add-loader"
import { PropertyLevelsList } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/levels/components/property-levels-list"
import { PropertyLevelsSkeleton } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/levels/components/property-levels-skeleton"

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
          <SkeletonSuspense skeleton={<SkeletonBox width="6rem" height={32} />}>
            <PropertyLevelAddLoader resonatorId={resonatorId} />
          </SkeletonSuspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <SkeletonSuspense skeleton={<PropertyLevelsSkeleton />}>
        <PropertyLevelsList resonatorId={resonatorId} />
      </SkeletonSuspense>
    </EditableSection.Root>
  )
}
