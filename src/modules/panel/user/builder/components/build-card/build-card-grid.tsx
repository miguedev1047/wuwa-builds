import { BuildCard } from "../../ui/build-card"
import { BuildCardSection } from "../../ui/build-card-section"
import { ResonatorInfoSection } from "./resonator-info-section"

/** Grid layout that arranges the build card sections. */
export function BuildCardGrid() {
  return (
    <BuildCard className="relative z-40 h-full max-h-227 w-auto md:ml-110">
      <div className="grid h-full w-full grid-cols-10 grid-rows-12 gap-4">
        <div className="col-start-1 col-end-7 row-start-1 row-end-2">
          <ResonatorInfoSection />
        </div>
        <div className="col-start-1 col-end-7 row-start-2 row-end-7">
          <BuildCardSection className="h-full w-full">Stats</BuildCardSection>
        </div>
        <div className="col-start-7 col-end-14 row-start-1 row-end-4">
          <BuildCardSection className="h-full w-full">Skills</BuildCardSection>
        </div>
        <div className="col-start-7 col-end-14 row-start-4 row-end-7">
          <BuildCardSection className="h-full w-full">Weapon</BuildCardSection>
        </div>
        <div className="col-start-1 col-end-14 row-start-7 row-end-13 grid grid-cols-5 gap-4">
          <div>
            <BuildCardSection className="h-full w-full">
              Eco Slot 1
            </BuildCardSection>
          </div>
          <BuildCardSection className="h-full w-full">
            Eco Slot 2
          </BuildCardSection>
          <BuildCardSection className="h-full w-full">
            Eco Slot 3
          </BuildCardSection>
          <BuildCardSection className="h-full w-full">
            Eco Slot 4
          </BuildCardSection>
          <BuildCardSection className="h-full w-full">
            Eco Slot 5
          </BuildCardSection>
        </div>
      </div>
    </BuildCard>
  )
}
