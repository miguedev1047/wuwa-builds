import { Image } from "@/components/ui/image"
import type { CharacterDetail } from "@game-data/domain/character"

type ResonatorPortraitProps = {
  resonator: Pick<CharacterDetail, "name" | "portrait">
}

/** Portrait of the selected resonator, full width on narrow screens. */
export function ResonatorPortrait({ resonator }: ResonatorPortraitProps) {
  return (
    <Image
      src={resonator.portrait}
      alt={resonator.name}
      size="xl"
      background="accent"
      aspect="portrait"
      className="max-sm:w-full"
    />
  )
}
