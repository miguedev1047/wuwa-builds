import { BuildCard } from "@builder/ui/build-card"
import { buildCardSectionAreas } from "@builder/components/build-card/build-card-grid-layout"
import { EchoSlotsSection } from "@builder/components/build-card/echo-slots-section"
import { ResonatorInfoSection } from "@builder/components/build-card/resonator-info-section"
import { SequenciesSection } from "@builder/components/build-card/sequencies-section"
import { SkillsSection } from "@builder/components/build-card/skills-section"
import { StatsSection } from "@builder/components/build-card/stats-section"
import { WeaponInfoSection } from "@builder/components/build-card/weapon-info-section"

/** Grid layout that arranges the build card sections. */
export function BuildCardGrid() {
  return (
    <BuildCard className="relative z-40 mt-100 w-auto scale-75 overflow-visible max-md:hidden">
      <SequenciesSection />

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
          <WeaponInfoSection />
        </div>

        <div className={buildCardSectionAreas.echoes}>
          <EchoSlotsSection />
        </div>
      </div>
    </BuildCard>
  )
}
