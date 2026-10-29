import { Show } from "@/components/utility/show"
import { useBuildDraftCollection } from "@/modules/builds/client/build-drafts-provider"
import { createEmptyBuildDraft } from "@/modules/builds/domain/build-draft"
import type { EncoreCharacterSummary } from "@/modules/encore/domain/character"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

interface CharacterItemProps {
  character: EncoreCharacterSummary
}

export function CharacterItem({ character }: CharacterItemProps) {
  const collection = useBuildDraftCollection()
  const navigate = useNavigate()

  const handleNewBuild = () => {
    if (!collection) {
      toast.error("Espera un momento y vuelve a intentarlo")
      return
    }

    const id = crypto.randomUUID()
    const draft = createEmptyBuildDraft({
      id,
      characterId: character.id,
      createdAt: new Date().toISOString(),
    })

    collection.insert(draft)
    navigate({ to: "/panel/builder/$draftId", params: { draftId: id } })
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
