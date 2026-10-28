import { Show } from "@/components/utility/show"
import type { EncoreCharacterSummary } from "@/modules/encore/domain/character"
import { Link } from "@tanstack/react-router"

interface CharacterItemProps {
  character: EncoreCharacterSummary
}

export function CharacterItem({ character }: CharacterItemProps) {
  const resonatorId = character.id.toString()

  return (
    <Link to="/admin/resonator/$id" params={{ id: resonatorId }}>
      <li role="button" className="aspect-2/3 overflow-hidden">
        <Show when={character.icon}>
          {(image) => (
            <img
              className="size-full object-cover transition-transform ease-in-out hover:scale-120"
              src={image}
            />
          )}
        </Show>
      </li>
    </Link>
  )
}
