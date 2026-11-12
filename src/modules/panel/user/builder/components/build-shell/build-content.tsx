import { Show } from "@/components/utility/show"
import { useBuilderId } from "@builder/application/use-builder-id"
import { BuildCanvas } from "@builder/components/build-canvas"
import { ResonatorGrid } from "@builder/sections/resonator-section/components/resonator-grid"
import { ResonatorBuilderSection } from "@builder/sections/resonator-section"
import { EchoesBuilderSection } from "@builder/sections/echoes-section"
import { WeaponBuilderSection } from "@builder/sections/weapon-section"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { BuildCardSection } from "../../ui/build-card-section"
import { BuildTextHeader } from "../../ui/build-text-header"

/**
 * Body of the builder route.
 *
 * A build without a resonator shows the catalog grid; once one is selected the
 * editor sections and the downloadable card render together.
 */
export function BuildContent() {
  const buildId = useBuilderId()
  const { data } = useBuildCollection({ buildId })

  return (
    <div className="space-y-12">
      <Show
        when={data?.resonator.data}
        fallback={
          <BuildCardSection>
            <BuildTextHeader>Selecciona un resonador</BuildTextHeader>
            <ResonatorGrid buildId={buildId} columns={10} aspect="portrait" />
          </BuildCardSection>
        }
      >
        <ResonatorBuilderSection />
        <WeaponBuilderSection />
        <EchoesBuilderSection />
        <BuildCanvas />
      </Show>
    </div>
  )
}
