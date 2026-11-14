import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreCharacterQueries } from "@encore/queries/characters"
import { characterQueries } from "@catalog/queries/characters"
import { ResonatorTagsEditAction } from "@catalog/presentation/resonators/detail/sections/tags/components/resonator-tags-edit-action"

type ResonatorTagsEditLoaderProps = {
  resonatorId: number
}

/** Small suspended action of the tags section header. */
export function ResonatorTagsEditLoader({
  resonatorId,
}: ResonatorTagsEditLoaderProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { data: encoreCharacter } = useSuspenseQuery(
    encoreCharacterQueries.detail(resonatorId)
  )

  return (
    <ResonatorTagsEditAction
      resonatorId={resonatorId}
      savedTags={resonator.tags}
      encoreTags={encoreCharacter.tags}
    />
  )
}
