import { Show } from "@/components/utility/show"
import { useBuildDraftCollection } from "@/modules/builds/client/build-drafts-provider"
import { createBuildDraftFromEncoreCharacter } from "@/modules/builds/infrastructure/encore/build-draft"
import type { EncoreCharacterSummary } from "@/modules/encore/domain/character"
import { characterQueries } from "@/modules/encore/queries/characters"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { cn } from "cn"
import { useTransition } from "react"
import { toast } from "sonner"

interface CharacterItemProps {
  character: EncoreCharacterSummary
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
        const draft = createBuildDraftFromEncoreCharacter({
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
