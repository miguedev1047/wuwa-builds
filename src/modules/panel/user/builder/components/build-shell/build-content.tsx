import { Show } from "@/components/utility/show"
import { useBuilderId } from "@builder/application/use-builder-id"
import { BuildCanvas } from "@builder/components/build-canvas"
import { BuildWorkspace } from "@builder/components/workspace"
import { EchoesBuilderSection } from "@builder/sections/echoes-section"
import { ResonatorGrid } from "@builder/sections/resonator-section/components/resonator-grid"
import { ResonatorBuilderSection } from "@builder/sections/resonator-section"
import { WeaponBuilderSection } from "@builder/sections/weapon-section"
import { BuildCardSection } from "@builder/ui/build-card-section"
import { BuildTextHeader } from "@builder/ui/build-text-header"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"

/**
 * Body of the builder route.
 *
 * A build without a resonator shows the catalog grid; once one is selected the
 * canvas and the editor rail render inside the workspace shell.
 */
export function BuildContent() {
  const buildId = useBuilderId()
  const { data } = useBuildCollection({ buildId })

  return (
    <Show
      when={data?.resonator.data}
      fallback={
        <div className="min-h-0 flex-1 overflow-y-auto">
          <BuildCardSection>
            <BuildTextHeader>Selecciona un resonador</BuildTextHeader>
            <ResonatorGrid buildId={buildId} columns={10} aspect="portrait" />
          </BuildCardSection>
        </div>
      }
    >
      <BuildWorkspace.Root>
        <BuildWorkspace.Stage>
          <BuildWorkspace.Preview>
            <BuildCanvas.Root>
              <BuildCanvas.Sequences />
              <BuildCanvas.Resonator />
              <BuildCanvas.Stats />
              <BuildCanvas.Skills />
              <BuildCanvas.Weapon />
              <BuildCanvas.Echoes />
            </BuildCanvas.Root>
          </BuildWorkspace.Preview>
        </BuildWorkspace.Stage>

        <BuildWorkspace.Rail>
          <ResonatorBuilderSection />
          <WeaponBuilderSection />
          <EchoesBuilderSection />
        </BuildWorkspace.Rail>
      </BuildWorkspace.Root>
    </Show>
  )
}
