import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { characterQueries } from "@game-data/queries/characters"
import { ResonatorDeleteAction } from "@panel/admin/game-data/views/resonators/detail/sections/info/components/resonator-delete-action"
import { ResonatorEditAction } from "@panel/admin/game-data/views/resonators/detail/sections/info/components/resonator-edit-action"

type ResonatorInfoContentProps = {
  resonatorId: number
}

/** Suspended summary block of the resonator. */
export function ResonatorInfoContent({
  resonatorId,
}: ResonatorInfoContentProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

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
        <CatalogSection.Image
          src={resonator.iconLarge}
          alt={resonator.name}
          background="accent"
          size="md"
          aspect="portrait"
          className="object-contain"
        />

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
