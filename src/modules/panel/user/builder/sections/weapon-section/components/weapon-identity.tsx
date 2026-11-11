import { BuildTextHeader } from "@builder/ui/build-text-header"
import { WeaponPickerDialog } from "@builder/sections/weapon-section/components/weapon-picker-dialog"
import type { WeaponDetail } from "@game-data/domain/weapon"

type WeaponIdentityProps = {
  weapon: Pick<WeaponDetail, "name">
}

/** Name and change action of the selected weapon. */
export function WeaponIdentity({ weapon }: WeaponIdentityProps) {
  return (
    <div className="flex items-center gap-2">
      <BuildTextHeader>{weapon.name}</BuildTextHeader>
      <WeaponPickerDialog />
    </div>
  )
}
