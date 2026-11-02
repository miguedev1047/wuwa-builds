import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreCharacterQueries } from "@/modules/encore/queries/characters"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorTagsEditAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/tags/components/resonator-tags-edit-action"

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
