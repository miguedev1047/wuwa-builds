import { Show } from "@/components/utility/show"
import { useBuildDraftCollection } from "@/modules/builds/client/build-drafts-provider"
import { createBuildDraftFromCharacter } from "@/modules/builds/infrastructure/catalog/build-draft"
import type { CharacterSummary } from "@/modules/game-data/domain/character"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { cn } from "cn"
import { useTransition } from "react"
import { toast } from "sonner"

interface CharacterItemProps {
  character: CharacterSummary
}

export function CharacterItem({ character }: CharacterItemProps) {
  const collection = useBuildDraftCollection()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isPending, startTransition] = useTransition()

  const handleNewBuild = () => {
    if (!collection || isPending) return

    startTransition(async () => {
      try {
        const characterDetail = await queryClient.query(
          characterQueries.detail(character.id)
        )

        const id = crypto.randomUUID()
        const draft = createBuildDraftFromCharacter({
          id,
          character: characterDetail,
          createdAt: new Date().toISOString(),
        })

        collection.insert(draft)

        await navigate({
          to: "/panel/builder/$draftId",
          params: { draftId: id },
        })
      } catch (error) {
        console.error(error)
        toast.error("No se pudo cargar el personaje para crear la build")
      }
    })
  }

  return (
    <li
      onClick={handleNewBuild}
      role="button"
      data-disabled={isPending}
      className={cn(
        "aspect-2/3 overflow-hidden",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
      )}
    >
      <Show when={character.iconLarge}>
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
