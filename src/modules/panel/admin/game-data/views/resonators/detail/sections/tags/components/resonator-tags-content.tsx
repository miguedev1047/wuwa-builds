import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreCharacterQueries } from "@/modules/encore/queries/characters"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorTagsForm } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/tags/components/resonator-tags-form"

type ResonatorTagsContentProps = {
  resonatorId: number
}

/** Suspended tags form of the resonator. */
export function ResonatorTagsContent({
  resonatorId,
}: ResonatorTagsContentProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { data: encoreCharacter } = useSuspenseQuery(
    encoreCharacterQueries.detail(resonatorId)
  )

  return (
    <ResonatorTagsForm
      resonatorId={resonatorId}
      savedTags={resonator.tags}
      encoreTags={encoreCharacter.tags}
    />
  )
}
