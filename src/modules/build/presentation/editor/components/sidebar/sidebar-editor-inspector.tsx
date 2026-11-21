import { useBuildCollection } from "@/modules/build/client/hooks/build-live-queries"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { Show } from "@/components/utility/show"
import { ResonatorEditorSection } from "@build/presentation/editor/sections/resonator-section"
import { WeaponEditorSection } from "@build/presentation/editor/sections/weapon-section"
import { EchoesEditorSection } from "@build/presentation/editor/sections/echoes-section"
import { AppearanceSection } from "@build/presentation/editor/sections/appearance-section"
import { Sheet } from "@/components/panelui/sheet"
import { useEditorSection } from "@build/presentation/editor/state/editor-section-context"
import type { BuildProps } from "@build/domain/build-record"

type SidebarEditorInspectorProps = {
  /** Whether to render the mobile Sheet behavior. */
  isMobile: boolean
  /** Whether the desktop panel or mobile Sheet is open. */
  open: boolean
  /** Updates the mobile Sheet open state. */
  onOpenChange: (open: boolean) => void
}

/** Shows the active editor section as a desktop panel or mobile Sheet. */
export function SidebarEditorInspector({
  isMobile,
  open,
  onOpenChange,
}: SidebarEditorInspectorProps) {
  const { buildId, userId } = useBuildIdentity()
  const { data } = useBuildCollection({ buildId, userId })

  return (
    <Show when={data}>
      {(build) => (
        <Show
          when={isMobile}
          fallback={
            <Show when={open}>
              <InspectorPanel build={build} />
            </Show>
          }
        >
          <Sheet side="bottom" open={open} onOpenChange={onOpenChange}>
            <Sheet.Content
              className="bg-sidebar p-0 text-sidebar-foreground"
              detached={false}
            >
              <Sheet.Header title="Editor" />
              <Sheet.Body className="min-h-0 flex-1 p-4">
                <InspectorSections build={build} />
              </Sheet.Body>
            </Sheet.Content>
          </Sheet>
        </Show>
      )}
    </Show>
  )
}

function InspectorPanel({ build }: { build: BuildProps }) {
  return (
    <aside className="no-scrollbar hidden h-full w-90 shrink-0 flex-col overflow-y-auto bg-sidebar p-4 text-sidebar-foreground md:flex">
      <InspectorSections build={build} />
    </aside>
  )
}

function InspectorSections({ build }: { build: BuildProps }) {
  const { section } = useEditorSection()

  return (
    <>
      <Show when={section === "resonator"}>
        <ResonatorEditorSection build={build} />
      </Show>
      <Show when={section === "weapon"}>
        <WeaponEditorSection build={build} />
      </Show>
      <Show when={section === "echo"}>
        <EchoesEditorSection build={build} />
      </Show>
      <Show when={section === "appareance"}>
        <AppearanceSection build={build} />
      </Show>
    </>
  )
}
