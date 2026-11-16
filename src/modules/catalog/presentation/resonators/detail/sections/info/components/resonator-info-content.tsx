import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorDeleteAction } from "@catalog/presentation/resonators/detail/sections/info/components/resonator-delete-action"
import { ResonatorEditAction } from "@catalog/presentation/resonators/detail/sections/info/components/resonator-edit-action"
import { characterQueries } from "@catalog/queries/characters"
import { useSuspenseQuery } from "@tanstack/react-query"

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

        <EditableSection.Actions>
          <ResonatorEditAction resonator={resonator} />
          <ResonatorDeleteAction resonatorId={resonatorId} />
        </EditableSection.Actions>
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
