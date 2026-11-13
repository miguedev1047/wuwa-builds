import { Image } from "@/components/ui/image"
import type { BuildProps } from "@/modules/builds/domain/build-record"
import type { CharacterDetail } from "@game-data/domain/character"
import { ResonatorBaseStats } from "@builder/sections/resonator-section/components/resonator-base-stats"
import { BuildWorkspace } from "@builder/components/workspace"

type ResonatorPortraitProps = {
  resonator: CharacterDetail
  build: BuildProps
}

/** Portrait of the selected resonator, full width on narrow screens. */
export function ResonatorPortrait({
  resonator,
  build,
}: ResonatorPortraitProps) {
  return (
    <div className="space-y-2">
      <BuildWorkspace.Text size="sm">{resonator.name}</BuildWorkspace.Text>
      <div className="flex min-h-40 items-stretch gap-2 md:min-h-32">
        <Image
          src={resonator.iconLarge}
          alt={resonator.name}
          background="accent"
          aspect="portrait"
          className="h-auto w-28 shrink-0 object-cover md:w-24"
        />
        <ResonatorBaseStats
          properties={resonator.properties}
          level={build.resonator.level}
        />
      </div>
    </div>
  )
}
