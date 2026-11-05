import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreCharacterQueries } from "@/modules/encore/queries/characters"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { findEncoreProperty } from "@/modules/panel/admin/game-data/views/resonators/detail/application/property-level-draft"
import { PropertyLevelRow } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/levels/components/property-level-row"

type PropertyLevelsListProps = {
  resonatorId: number
}

/** Suspended list of the resonator base stats. */
export function PropertyLevelsList({ resonatorId }: PropertyLevelsListProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { data: encoreCharacter } = useSuspenseQuery(
    encoreCharacterQueries.detail(resonatorId)
  )

  return (
    <EditableSection.Content>
      <EditableSection.List
        items={resonator.properties}
        getItemKey={(property) => property.id}
        empty={
          <EditableSection.Text>
            Sin propiedades agregadas.
          </EditableSection.Text>
        }
      >
        {(property) => (
          <PropertyLevelRow
            property={property}
            resonatorId={resonatorId}
            encoreProperty={findEncoreProperty(
              encoreCharacter.properties,
              property.name
            )}
          />
        )}
      </EditableSection.List>
    </EditableSection.Content>
  )
}
