import { WeaponInfoSection } from "@catalog/presentation/weapons/detail/sections/info"
import { WeaponLevelsSection } from "@catalog/presentation/weapons/detail/sections/levels"
import { WeaponRefinementsSection } from "@catalog/presentation/weapons/detail/sections/refinements"

export function WeaponDetail({ weaponId }: { weaponId: number }) {
  return (
    <div className="space-y-10">
      <WeaponInfoSection weaponId={weaponId} />
      <WeaponLevelsSection weaponId={weaponId} />
      <WeaponRefinementsSection weaponId={weaponId} />
    </div>
  )
}
