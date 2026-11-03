import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { echoDetailDockActions } from "@/modules/panel/admin/game-data/views/echoes/detail/dock-actions"
import { EchoInfoSection } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/info"
import { EchoSetsSection } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/sets"

export function EchoDetailPage() {
  return (
    <div className="space-y-10">
      <EchoInfoSection />
      <EchoSetsSection />

      <CatalogSection.DockActions items={echoDetailDockActions} />
    </div>
  )
}
