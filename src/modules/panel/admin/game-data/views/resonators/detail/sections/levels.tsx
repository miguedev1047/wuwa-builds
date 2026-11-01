import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { SkeletonSuspense } from "skullet/react"
import { encoreCharacterQueries } from "@/modules/encore/queries/characters"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"

export function ResonatorLevelsSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Niveles</EditableSection.Title>
        <EditableSection.Description>
          En esta seccion puedes agregar niveles al resonador
        </EditableSection.Description>
      </EditableSection.Header>

      <SkeletonSuspense skeleton={<p>Cargando...</p>}>
        <ResonatorLevelsLoader resonatorId={resonatorId} />
      </SkeletonSuspense>
    </EditableSection.Root>
  )
}

type ResonatorLevelsLoaderProps = {
  resonatorId: number
}

export function ResonatorLevelsLoader({
  resonatorId,
}: ResonatorLevelsLoaderProps) {
  useSuspenseQuery(characterQueries.detail(resonatorId))
  useSuspenseQuery(encoreCharacterQueries.detail(resonatorId))

  return <div />
}
