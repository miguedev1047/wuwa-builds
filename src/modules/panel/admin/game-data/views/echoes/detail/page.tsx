import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { echoDetailDockActions } from "@/modules/panel/admin/game-data/views/echoes/detail/dock-actions"
import { EchoInfoSection } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/info"

export function EchoDetailPage() {
  return (
    <div className="space-y-10">
      <EchoInfoSection />

      <CatalogSection.DockActions items={echoDetailDockActions} />
    </div>
  )
}
