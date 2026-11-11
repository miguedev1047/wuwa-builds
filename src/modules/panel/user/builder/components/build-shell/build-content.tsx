import { Show } from "@/components/utility/show"
import { useBuilderId } from "@builder/application/use-builder-id"
import { BuildCardGrid } from "@builder/components/build-card"
import { ResonatorGrid } from "@builder/sections/resonator-section/components/resonator-grid"
import { ResonatorBuilderSection } from "@builder/sections/resonator-section"
import { WeaponBuilderSection } from "@builder/sections/weapon-section"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"

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
          <div className="space-y-3 rounded-2xl border border-dashed p-6">
            <ResonatorGrid buildId={buildId} columns={10} aspect="portrait" />
          </div>
        }
      >
        <ResonatorBuilderSection />
        <WeaponBuilderSection />
        <BuildCardGrid />
      </Show>
    </div>
  )
}
