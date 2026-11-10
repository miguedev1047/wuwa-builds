import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { resonatorDetailDockActions } from "@panel/admin/game-data/views/resonators/detail/dock-actions"
import { ResonatorInfoSection } from "@panel/admin/game-data/views/resonators/detail/sections/info"
import { ResonatorMediaSection } from "@panel/admin/game-data/views/resonators/detail/sections/media"
import { ResonatorSkillsSection } from "@panel/admin/game-data/views/resonators/detail/sections/skills"
import { ResonatorSequencesSection } from "@panel/admin/game-data/views/resonators/detail/sections/sequences"
import { ResonatorPassivesSection } from "@panel/admin/game-data/views/resonators/detail/sections/passives"
import { ResonatorTagsSection } from "@panel/admin/game-data/views/resonators/detail/sections/tags"
import { ResonatorLevelsSection } from "@panel/admin/game-data/views/resonators/detail/sections/levels"

export function ResonatorDetailPage() {
  return (
    <div className="space-y-10">
      <ResonatorInfoSection />
      <ResonatorMediaSection />
      <ResonatorSkillsSection />
      <ResonatorSequencesSection />
      <ResonatorPassivesSection />
      <ResonatorTagsSection />
      <ResonatorLevelsSection />

      <CatalogSection.DockActions items={resonatorDetailDockActions} />
    </div>
  )
}
