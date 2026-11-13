import type { ReactElement } from "react"
import { Show } from "@/components/utility/show"
import type { BuildProps } from "@builds/domain/build-record"
import { BuildHeader } from "@builder/components/workspace/build-header"
import { BuildWorkspace } from "@builder/components/workspace/build-workspace"
import { BuildWorkspacePreview } from "@builder/components/workspace/build-workspace-preview"
import { BuildWorkspaceStage } from "@builder/components/workspace/build-workspace-stage"
import { EchoesBuilderSection } from "@builder/sections/echoes-section"
import { ResonatorBuilderSection } from "@builder/sections/resonator-section"
import { WeaponBuilderSection } from "@builder/sections/weapon-section"

type BuildEditorWorkspaceProps = {
  build: BuildProps
  backLink: ReactElement
  onRename: (name: string) => void
  onDelete: () => void
}

/** Compose the editor header, interactive preview and editing rail. */
export function BuildEditorWorkspace({
  build,
  backLink,
  onRename,
  onDelete,
}: BuildEditorWorkspaceProps) {
  return (
    <div className="container mx-auto flex min-h-dvh w-full flex-col gap-6 p-3 md:p-6 xl:h-dvh xl:overflow-hidden">
      <BuildHeader
        name={build.name}
        backLink={backLink}
        onRename={onRename}
        onDelete={onDelete}
      />

      <BuildWorkspace.Root>
        <BuildWorkspace.Canvas>
          <BuildWorkspace.Content>
            <Show when={build.resonator.data}>
              {(resonator) => (
                <BuildWorkspaceStage>
                  <BuildWorkspacePreview
                    build={build}
                    resonatorId={resonator.id}
                  />
                </BuildWorkspaceStage>
              )}
            </Show>
          </BuildWorkspace.Content>
        </BuildWorkspace.Canvas>

        <BuildWorkspace.Rail>
          <ResonatorBuilderSection build={build} />
          <WeaponBuilderSection build={build} />
          <EchoesBuilderSection build={build} />
        </BuildWorkspace.Rail>
      </BuildWorkspace.Root>
    </div>
  )
}
