import { Image } from "@/components/ui/image"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { updateBuild } from "@/modules/builds/client/build-store"
import type { CharacterSummary } from "@/modules/game-data/domain/character"
import { useSelectResonator } from "@/modules/panel/user/builder/application/use-select-resonator"

export type ResonatorAspect = "square" | "portrait"

interface ResonatorItemProps {
  resonator: CharacterSummary
  buildId: string
  aspect?: ResonatorAspect
  onSelect?: () => void
}

/** One resonator card with the image that matches the requested aspect. */
export function ResonatorItem({
  resonator,
  buildId,
  aspect = "portrait",
  onSelect,
}: ResonatorItemProps) {
  const { selectResonator, preloadResonator } = useSelectResonator(buildId)

  const handleSelect = async () => {
    const success = await selectResonator(resonator)

    if (success) {
      preloadResonator(resonator)
      onSelect?.()
    }

    updateBuild(buildId, (current) => {
      current.name = `Build de ${resonator.name}`
    })
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={resonator.name}
            className="block w-full text-left"
            onClick={handleSelect}
          >
            <Image
              src={resonator.iconLarge}
              alt={resonator.name}
              aspect={aspect}
              size="full"
              rounded="xl"
              hover="zoom"
            />
          </button>
        }
      />
      <TooltipContent>{resonator.name}</TooltipContent>
    </Tooltip>
  )
}
