import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { SkeletonSuspense } from "skullet/react"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorDeleteAction } from "@/modules/panel/admin/game-data/views/resonators/detail/components/delete-action"
import { ResonatorEditAction } from "@/modules/panel/admin/game-data/views/resonators/detail/components/edit-action"
import { ResonatorInfoSkeleton } from "@/modules/panel/admin/game-data/views/resonators/detail/ui-states/info-skeleton"

export function ResonatorInfoSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  return (
    <SkeletonSuspense skeleton={<ResonatorInfoSkeleton />}>
      <ResonatorInfoContent resonatorId={resonatorId} />
    </SkeletonSuspense>
  )
}

type ResonatorInfoContentProps = {
  resonatorId: number
}

function ResonatorInfoContent({ resonatorId }: ResonatorInfoContentProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  if (!resonator) {
    return null
  }

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>
          Resonador: {resonator.name}
        </EditableSection.Title>

        <EditableSection.Action>
          <ResonatorEditAction resonator={resonator} />
          <ResonatorDeleteAction />
        </EditableSection.Action>
      </EditableSection.Header>

      <EditableSection.Content className="flex w-full flex-col items-start gap-4 md:flex-row">
        <EditableSection.Media className="aspect-2/3 w-40">
          <CatalogSection.Image
            src={resonator.iconLarge}
            alt={resonator.name}
            className="size-full object-cover"
          />
        </EditableSection.Media>

        <EditableSection.Body>
          <EditableSection.Heading>{resonator.name}</EditableSection.Heading>
          <EditableSection.Text
            dangerouslySetInnerHTML={{ __html: resonator.introduction }}
          />
        </EditableSection.Body>
      </EditableSection.Content>
    </EditableSection.Root>
  )
}
