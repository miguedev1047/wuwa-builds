import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreCharacterQueries } from "@/modules/encore/queries/characters"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { PropertyLevelAddAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/levels/components/property-level-add-action"

type PropertyLevelAddLoaderProps = {
  resonatorId: number
}

/** Small suspended action of the section header. */
export function PropertyLevelAddLoader({
  resonatorId,
}: PropertyLevelAddLoaderProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { data: encoreCharacter } = useSuspenseQuery(
    encoreCharacterQueries.detail(resonatorId)
  )

  const savedNames = resonator.properties.map((property) => property.name)
  const sortOrder =
    resonator.properties.reduce(
      (max, property) => Math.max(max, property.sortOrder),
      0
    ) + 1

  return (
    <PropertyLevelAddAction
      resonatorId={resonatorId}
      sortOrder={sortOrder}
      isMaxProperties={resonator.properties.length >= 6}
      encoreProperties={encoreCharacter.properties}
      savedNames={savedNames}
    />
  )
}
