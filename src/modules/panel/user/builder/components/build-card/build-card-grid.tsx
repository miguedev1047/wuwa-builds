import { BuildCard } from "../../ui/build-card"
import { EchoSlotsSection } from "./echo-slots-section"
import { ResonatorInfoSection } from "./resonator-info-section"
import { SkillsSection } from "./skills-section"
import { StatsSection } from "./stats-section"
import { WeaponSection } from "./weapon-section"

/** Grid layout that arranges the build card sections. */
export function BuildCardGrid() {
  return (
    <BuildCard className="relative z-40 h-full max-h-227 w-auto md:ml-110">
      <div className="grid h-full w-full grid-cols-10 grid-rows-12 gap-4">
        <div className="col-start-1 col-end-7 row-start-1 row-end-2">
          <ResonatorInfoSection />
        </div>
        <div className="col-start-1 col-end-7 row-start-2 row-end-7">
          <StatsSection />
        </div>
        <div className="col-start-7 col-end-14 row-start-1 row-end-4">
          <SkillsSection />
        </div>
        <div className="col-start-7 col-end-14 row-start-4 row-end-7">
          <WeaponSection />
        </div>
        <div className="col-start-1 col-end-14 row-start-7 row-end-13">
          <EchoSlotsSection />
        </div>
      </div>
    </BuildCard>
  )
}
