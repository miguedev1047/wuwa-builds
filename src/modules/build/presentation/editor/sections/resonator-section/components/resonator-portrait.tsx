import { Image } from "@/components/ui/image"
import type { CharacterDetail } from "@catalog/domain/character"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { optionLabel } from "@catalog/application/options"
import {
  RESONATOR_ELEMENTS,
  RESONATOR_WEAPON_TYPES,
} from "@catalog/application/constants/resonator"
import { GameIcon, gameIconName } from "@/components/ui/game-icon"

type ResonatorPortraitProps = {
  resonator: CharacterDetail
}

/** Portrait of the selected resonator, full width on narrow screens. */
export function ResonatorPortrait({ resonator }: ResonatorPortraitProps) {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={resonator.iconLarge}
        alt={resonator.name}
        background="accent"
        aspect="square"
        size="md"
      />

      <div className="space-y-1">
        <BuildWorkspace.Text size="xl" family="bold">
          {resonator.name}
        </BuildWorkspace.Text>
        <div className="flex items-center gap-1">
          <GameIcon className="size-4" name={gameIconName(resonator.element)} />
          <p className="text-xs text-muted-foreground">
            {optionLabel(RESONATOR_ELEMENTS, resonator.element as never)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <GameIcon
            className="size-4"
            name={gameIconName(resonator.weaponType)}
          />
          <p className="text-xs text-muted-foreground">
            {optionLabel(RESONATOR_WEAPON_TYPES, resonator.weaponType as never)}
          </p>
        </div>
      </div>
    </div>
  )
}
