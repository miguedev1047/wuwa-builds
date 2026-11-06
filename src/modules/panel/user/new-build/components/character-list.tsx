import { characterQueries } from "@/modules/game-data/queries/characters"
import { CharacterItem } from "@/modules/panel/user/new-build/components/character-item"
import { useSuspenseQuery } from "@tanstack/react-query"

export function CharacterList() {
  const { data: characters } = useSuspenseQuery(characterQueries.list())

  return (
    <ul className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8">
      {characters.map((character) => (
        <CharacterItem key={character.id} character={character} />
      ))}
    </ul>
  )
}
