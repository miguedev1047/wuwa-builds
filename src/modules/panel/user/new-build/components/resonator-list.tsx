import { ResonatorItem } from "@/modules/panel/user/new-build/components/resonator-item"
import { characterQueries } from "@/modules/encore/queries/characters"
import { useSuspenseQuery } from "@tanstack/react-query"

export function ResonatorLists() {
  const { data: characters } = useSuspenseQuery(characterQueries.list())

  return (
    <ul className="grid grid-cols-10 gap-4">
      {characters.map((character) => (
        <ResonatorItem key={character.id} resonator={character} />
      ))}
    </ul>
  )
}
