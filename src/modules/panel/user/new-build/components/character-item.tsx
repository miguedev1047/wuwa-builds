import { Show } from "@/components/utility/show"
import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import type {
  CharacterDetail,
  CharacterSummary,
} from "@/modules/game-data/domain/character"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate, useRouteContext, useRouter } from "@tanstack/react-router"

interface CharacterItemProps {
  character: CharacterSummary
}

const genResonatorSkills = (skills: CharacterDetail["skills"]) => {
  const resonatorSkills = skills.map((skill) => ({
    id: skill.id,
    skillId: skill.skillId,
    level: 10,
  }))
  return resonatorSkills
}

const genResonatorPassives = (resonator: CharacterDetail) => {
  const ORDERED_INDEX = [0, 1, 8, 2, 3, 4, 5, 9, 6, 7]

  const rawPassives = [
    ...resonator.passives.map((p) => ({
      id: p.id,
      passiveId: p.passiveId,
      name: p.title,
      value: p.valueNumber,
      icon: p.icon,
      type: "passive" as const,
    })),
    ...resonator.skills.slice(5, 7).map((s) => ({
      id: s.id,
      passiveId: s.skillId,
      name: s.name,
      value: 0,
      icon: s.icon,
      type: "skill" as const,
    })),
  ]

  return ORDERED_INDEX.map((index) => rawPassives[index])
    .filter((item): item is NonNullable<typeof item> => item !== undefined)
    .map((item) => ({ ...item, enabled: true }))
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

      buildCollection.insert({
        buildId,
        sessionId: session.session.id,
        name: `${character.name} Build`,
        createdAt: genDate,
        updateAt: genDate,
        resonator: {
          level: 90,
          sequency: 0,
          data: character,
          skills: resonatorSkills,
          passives: resonatorPassives,
        },
      })

      navigate({
        to: "/panel/builder/r/$rosterId/b/$buildId",
        params: { buildId, rosterId: resonatorId },
      })
    } catch {}
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
