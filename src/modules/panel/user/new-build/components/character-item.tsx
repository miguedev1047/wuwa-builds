import { Show } from "@/components/utility/show"
import type { EncoreCharacterSummary } from "@/modules/encore/domain/character"
import { getCharacter } from "@/modules/encore/server/characters"
import { toast } from "sonner"

interface CharacterItemItemProps {
  character: EncoreCharacterSummary
}

export function CharacterItem({ character }: CharacterItemItemProps) {
  const handleNewBuild = async () => {
    try {
      const characterData = await getCharacter({ data: { id: character.id } })
      console.log(characterData)
    } catch (err) {
      console.error(err)
      toast.error("Ha ocurrido un error al obtener el resonador")
    }
  }

  return (
    <li
      onClick={handleNewBuild}
      role="button"
      className="aspect-2/3 overflow-hidden"
    >
      <Show when={character.icon}>
        {(image) => (
          <img
            className="size-full object-cover transition-transform ease-in-out hover:scale-120"
            src={image}
          />
        )}
      </Show>
    </li>
  )
}
