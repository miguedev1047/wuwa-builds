import { BuildCard } from "../../ui/build-card"
import { EchoSlotsSection } from "./echo-slots-section"
import { buildCardSectionAreas } from "./build-card-grid-layout"
import { ResonatorInfoSection } from "./resonator-info-section"
import { SkillsSection } from "./skills-section"
import { StatsSection } from "./stats-section"
import { WeaponSection } from "./weapon-section"

/** Grid layout that arranges the build card sections. */
export function BuildCardGrid() {
  return (
    <BuildCard className="relative z-40 h-full max-h-227 w-auto md:ml-110">
      <div className="grid h-full w-full grid-cols-1 gap-4 overflow-y-auto md:grid-cols-10 md:grid-rows-12 md:overflow-visible">
        <div className={buildCardSectionAreas.resonator}>
          <ResonatorInfoSection />
        </div>
        <div className={buildCardSectionAreas.stats}>
          <StatsSection />
        </div>
        <div className={buildCardSectionAreas.skills}>
          <SkillsSection />
        </div>
        <div className={buildCardSectionAreas.weapon}>
          <WeaponSection />
        </div>
        <div className={buildCardSectionAreas.echoes}>
          <EchoSlotsSection />
        </div>
      </div>
    </BuildCard>
  )
}
