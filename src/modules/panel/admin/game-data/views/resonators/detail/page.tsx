import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { resonatorDetailDockActions } from "@/modules/panel/admin/game-data/views/resonators/detail/dock-actions"
import { ResonatorInfoSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/info"
import { ResonatorTagsSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/tags"

export function ResonatorDetailPage() {
  return (
    <div className="space-y-10">
      <ResonatorInfoSection />
      <ResonatorTagsSection />

      <CatalogSection.DockActions items={resonatorDetailDockActions} />
    </div>
  )
}
