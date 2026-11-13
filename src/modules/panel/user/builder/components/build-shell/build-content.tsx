import { Show } from "@/components/utility/show"
import { useBuilderId } from "@builder/application/use-builder-id"
import { BuildCanvas } from "@builder/components/build-canvas"
import { BuildWorkspace } from "@builder/components/workspace"
import { EchoesBuilderSection } from "@builder/sections/echoes-section"
import { ResonatorBuilderSection } from "@builder/sections/resonator-section"
import { WeaponBuilderSection } from "@builder/sections/weapon-section"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"

/**
 * Body of the builder route.
 *
 * A build without a resonator shows the catalog grid; once one is selected the
 * canvas and the editor rail render inside the workspace shell.
 */
export function BuildContent() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <BuildWorkspace.Root>
      <BuildWorkspace.Canvas>
        <BuildWorkspace.Content>
          <Show when={build?.resonator.data}>
            <BuildCanvas.Root>
              <BuildCanvas.Sequences />
              <BuildCanvas.Resonator />
              <BuildCanvas.Stats />
              <BuildCanvas.Skills />
              <BuildCanvas.Weapon />
              <BuildCanvas.Echoes />
            </BuildCanvas.Root>
          </Show>
        </BuildWorkspace.Content>
      </BuildWorkspace.Canvas>

      <BuildWorkspace.Rail>
        <ResonatorBuilderSection />
        <WeaponBuilderSection />
        <EchoesBuilderSection />
      </BuildWorkspace.Rail>
    </BuildWorkspace.Root>
  )
}
