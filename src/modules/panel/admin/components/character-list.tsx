import { characterQueries } from "@/modules/encore/queries/characters"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CharacterItem } from "@/modules/panel/admin/components/character-item"

export function CharacterList() {
  const { data: characters } = useSuspenseQuery(characterQueries.list())

  return (
    <ul className="grid grid-cols-10 gap-4">
      {characters.map((character) => (
        <CharacterItem key={character.id} character={character} />
      ))}
    </ul>
  )
}
