import { GameIcon, gameIconName } from "@/components/ui/game-icon"
import { BuildTextHeader } from "@builder/ui/build-text-header"
import { ResonatorPickerDialog } from "@builder/sections/resonator-section/components/resonator-picker-dialog"
import type { CharacterDetail } from "@game-data/domain/character"

type ResonatorIdentityProps = {
  resonator: Pick<CharacterDetail, "element" | "name">
}

/** Element, name and change action of the selected resonator. */
export function ResonatorIdentity({ resonator }: ResonatorIdentityProps) {
  return (
    <div className="flex items-center gap-2">
      <GameIcon className="size-7" name={gameIconName(resonator.element)} />
      <BuildTextHeader>{resonator.name}</BuildTextHeader>
      <ResonatorPickerDialog />
    </div>
  )
}
