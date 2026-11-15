import { useBuildCollection } from "@/modules/build/client/hooks/build-live-queries"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { Show } from "@/components/utility/show"
import { ResonatorEditorSection } from "@build/presentation/editor/sections/resonator-section"
import { WeaponEditorSection } from "@build/presentation/editor/sections/weapon-section"
import { EchoesEditorSection } from "@build/presentation/editor/sections/echoes-section"
import { AppearanceSection } from "@build/presentation/editor/sections/appearance-section"

export function SidebarEditorInspector() {
  const { buildId, sessionId } = useBuildIdentity()
  const { data } = useBuildCollection({ buildId, sessionId })

  const selectedResonatorSection = data?.selectedEditorSection === "resonator"
  const selectedWeaponSection = data?.selectedEditorSection === "weapon"
  const selectedEchoSection = data?.selectedEditorSection === "echo"
  const selectedAppearanceSection = data?.selectedEditorSection === "appareance"

  return (
    <Show when={data}>
      {(build) => (
        <div
          style={{ height: "100vh" }}
          className="no-scrollbar flex w-90 scroll-fade-y flex-col overflow-y-scroll bg-sidebar p-4 text-sidebar-foreground"
        >
          <Show when={selectedResonatorSection}>
            <ResonatorEditorSection build={build} />
          </Show>
          <Show when={selectedWeaponSection}>
            <WeaponEditorSection build={build} />
          </Show>
          <Show when={selectedEchoSection}>
            <EchoesEditorSection build={build} />
          </Show>
          <Show when={selectedAppearanceSection}>
            <AppearanceSection build={build} />
          </Show>
        </div>
      )}
    </Show>
  )
}
