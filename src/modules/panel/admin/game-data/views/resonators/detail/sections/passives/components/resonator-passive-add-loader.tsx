import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreCharacterQueries } from "@/modules/encore/queries/characters"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorPassiveAddAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/passives/components/resonator-passive-add-action"

type ResonatorPassiveAddLoaderProps = {
  resonatorId: number
}

/** Small suspended action of the passives section header. */
export function ResonatorPassiveAddLoader({
  resonatorId,
}: ResonatorPassiveAddLoaderProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { data: encoreCharacter } = useSuspenseQuery(
    encoreCharacterQueries.detail(resonatorId)
  )

  const savedPassiveIds = resonator.passives.map((passive) => passive.passiveId)
  const isMaxPassives = encoreCharacter.passives.every((passive) =>
    savedPassiveIds.includes(passive.id)
  )
  const sortOrder =
    resonator.passives.reduce(
      (max, passive) => Math.max(max, passive.sortOrder),
      0
    ) + 1

  return (
    <ResonatorPassiveAddAction
      resonatorId={resonatorId}
      sortOrder={sortOrder}
      isMaxPassives={isMaxPassives}
      encorePassives={encoreCharacter.passives}
      savedPassiveIds={savedPassiveIds}
    />
  )
}
