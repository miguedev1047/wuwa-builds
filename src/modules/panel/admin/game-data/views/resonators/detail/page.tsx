import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { resonatorDetailDockActions } from "@/modules/panel/admin/game-data/views/resonators/detail/dock-actions"
import { ResonatorInfoSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/info"

export function ResonatorDetailPage() {
  return (
    <>
      <ResonatorInfoSection />

      <CatalogSection.DockActions items={resonatorDetailDockActions} />
    </>
  )
}
