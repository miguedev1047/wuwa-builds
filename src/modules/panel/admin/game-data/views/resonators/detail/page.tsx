import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { resonatorDetailDockActions } from "@/modules/panel/admin/game-data/views/resonators/detail/dock-actions"
import { ResonatorInfoSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/info"
import { ResonatorSkillsSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/skills"
import { ResonatorSequencesSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/sequences"
import { ResonatorPassivesSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/passives"
import { ResonatorTagsSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/tags"
import { ResonatorLevelsSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/levels"

export function ResonatorDetailPage() {
  return (
    <div className="space-y-10">
      <ResonatorInfoSection />
      <ResonatorSkillsSection />
      <ResonatorSequencesSection />
      <ResonatorPassivesSection />
      <ResonatorTagsSection />
      <ResonatorLevelsSection />

      <CatalogSection.DockActions items={resonatorDetailDockActions} />
    </div>
  )
}
