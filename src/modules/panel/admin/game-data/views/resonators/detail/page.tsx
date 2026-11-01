import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { resonatorDetailDockActions } from "@/modules/panel/admin/game-data/views/resonators/detail/dock-actions"
import { ResonatorInfoSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/info"
import { ResonatorTagsSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/tags"
import { ResonatorLevelsSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/levels"

export function ResonatorDetailPage() {
  return (
    <div className="space-y-10">
      <ResonatorInfoSection />
      <ResonatorTagsSection />
      <ResonatorLevelsSection />

      <CatalogSection.DockActions items={resonatorDetailDockActions} />
    </div>
  )
}
