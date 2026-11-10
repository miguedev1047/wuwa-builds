import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { echoDetailDockActions } from "@panel/admin/game-data/views/echoes/detail/dock-actions"
import { EchoInfoSection } from "@panel/admin/game-data/views/echoes/detail/sections/info"
import { EchoSetsSection } from "@panel/admin/game-data/views/echoes/detail/sections/sets"
import { EchoSkillsSection } from "@panel/admin/game-data/views/echoes/detail/sections/skills"

export function EchoDetailPage() {
  return (
    <div className="space-y-10">
      <EchoInfoSection />
      <EchoSetsSection />
      <EchoSkillsSection />

      <CatalogSection.DockActions items={echoDetailDockActions} />
    </div>
  )
}
