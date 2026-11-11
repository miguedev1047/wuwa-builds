import { GameIcon, gameIconName } from "@/components/ui/game-icon"
import { BuildTextHeader } from "@builder/ui/build-text-header"
import { ResonatorPickerDialog } from "@builder/sections/resonator-section/components/resonator-picker-dialog"
import type { CharacterDetail } from "@game-data/domain/character"
import type { BuildProps } from "@/modules/builds/domain/build-record"
import { ResonatorSkillTreeDialog } from "./resonator-skill-tree-dialog"

type ResonatorIdentityProps = {
  resonator: Pick<CharacterDetail, "element" | "id" | "name">
  build: BuildProps
}

/** Element, name and change action of the selected resonator. */
export function ResonatorIdentity({
  build,
  resonator,
}: ResonatorIdentityProps) {
  return (
    <div className="flex items-center gap-2">
      <GameIcon className="size-7" name={gameIconName(resonator.element)} />
      <BuildTextHeader>{resonator.name}</BuildTextHeader>
      <ResonatorPickerDialog />
      <div className="ml-auto">
        <ResonatorSkillTreeDialog build={build} resonatorId={resonator.id} />
      </div>
    </div>
  )
}
