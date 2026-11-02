import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { weaponDetailDockActions } from "@/modules/panel/admin/game-data/views/weapons/detail/dock-actions"
import { WeaponInfoSection } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/info"

export function WeaponDetailPage() {
  return (
    <div className="space-y-10">
      <WeaponInfoSection />

      <CatalogSection.DockActions items={weaponDetailDockActions} />
    </div>
  )
}
