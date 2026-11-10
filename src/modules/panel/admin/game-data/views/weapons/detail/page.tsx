import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { weaponDetailDockActions } from "@panel/admin/game-data/views/weapons/detail/dock-actions"
import { WeaponInfoSection } from "@panel/admin/game-data/views/weapons/detail/sections/info"
import { WeaponLevelsSection } from "@panel/admin/game-data/views/weapons/detail/sections/levels"
import { WeaponRefinementsSection } from "@panel/admin/game-data/views/weapons/detail/sections/refinements"

export function WeaponDetailPage() {
  return (
    <div className="space-y-10">
      <WeaponInfoSection />
      <WeaponLevelsSection />
      <WeaponRefinementsSection />

      <CatalogSection.DockActions items={weaponDetailDockActions} />
    </div>
  )
}
