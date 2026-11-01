import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { resonatorDetailDockActions } from "@/modules/panel/admin/game-data/views/resonators/detail/dock-actions"
import { ResonatorInfoSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/info"
import { ResonatorTagsSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/tags"

export function ResonatorDetailPage() {
  return (
    <>
      <ResonatorInfoSection />
      <ResonatorTagsSection />

      <CatalogSection.DockActions items={resonatorDetailDockActions} />
    </>
  )
}
