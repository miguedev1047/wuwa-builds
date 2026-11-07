import { Show } from "@/components/utility/show"
import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import type { CharacterSummary } from "@/modules/game-data/domain/character"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate, useRouteContext, useRouter } from "@tanstack/react-router"
import { toast } from "sonner"
import {
  genEchoes,
  genResonatorPassives,
  genResonatorSkills,
} from "@/modules/panel/user/new-build/application/gen-build-data"
import {
  CHARACTER_LEVEL_MAX,
  WEAPON_LEVEL_MAX,
} from "@/modules/builds/domain/build"

interface CharacterItemProps {
  character: CharacterSummary
}

export function CharacterItem({ character }: CharacterItemProps) {
  const { session } = useRouteContext({ from: "/(panel)/panel" })
  const image = character.iconLarge || character.icon

  const resonatorId = character.id.toString()

  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()

  const preload = () => {
    void queryClient.query(characterQueries.detail(character.id))

    void router.preloadRoute({
      to: "/panel/builder/r/$rosterId",
      params: { rosterId: resonatorId },
    })
  }

  const handleSelect = async () => {
    const buildId = crypto.randomUUID()

    const genDate = new Date().toISOString()

    try {
      const resonator = await queryClient.query(
        characterQueries.detail(character.id)
      )

      const resonatorSkills = genResonatorSkills(resonator.skills)
      const resonatorPassives = genResonatorPassives(resonator)
      const echoes = genEchoes()

      buildCollection.insert({
        buildId,
        sessionId: session.session.id,
        name: `${character.name} Build`,
        createdAt: genDate,
        updateAt: genDate,
        resonator: {
          level: CHARACTER_LEVEL_MAX,
          sequency: 0,
          data: character,
          skills: resonatorSkills,
          passives: resonatorPassives,
        },
        weapon: {
          level: WEAPON_LEVEL_MAX,
          refinament: 1,
          data: null,
        },
        echoes,
      })

      navigate({
        to: "/panel/builder/r/$rosterId/b/$buildId",
        params: { buildId, rosterId: resonatorId },
      })
    } catch {
      toast.error("Ha ocurrido un error al seleccionar el resonador")
    }
  }

  return (
    <button
      type="button"
      aria-label={character.name}
      onMouseEnter={preload}
      onFocus={preload}
      onTouchStart={preload}
      onClick={() => handleSelect()}
      title={character.name}
      className="aspect-2/3 w-full overflow-hidden border border-transparent bg-accent"
    >
      <Show when={image}>
        {(src) => (
          <img
            src={src}
            alt={character.name}
            className="size-full object-cover transition-transform ease-in-out hover:scale-105"
          />
        )}
      </Show>
    </button>
  )
}
