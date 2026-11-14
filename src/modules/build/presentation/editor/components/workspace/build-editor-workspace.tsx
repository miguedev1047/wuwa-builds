import { type ReactElement } from "react"
import { BuildExportCard } from "@build/presentation/editor/components/workspace/build-export-card"
import { useBuildStats } from "@build/client/hooks/use-build-stats"
import { Show } from "@/components/utility/show"
import type { BuildProps } from "@build/domain/build-record"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace/build-workspace"
import { BuildWorkspacePreview } from "@build/presentation/editor/components/workspace/build-workspace-preview"
import { BuildWorkspaceStage } from "@build/presentation/editor/components/workspace/build-workspace-stage"
import { useDownloadBuild } from "@/modules/build/presentation/editor/hooks/use-build-download"
import { SidebarContainer } from "../sidebar"

type BuildEditorWorkspaceProps = {
  build: BuildProps
  backLink: ReactElement
  onRename: (name: string) => void
  onDelete: () => void
}

/** Compose the editor sidebar and interactive preview. */
export function BuildEditorWorkspace({ build }: BuildEditorWorkspaceProps) {
  const preview = useBuildStats(build)
  const { captureRef, exportSnapshot } = useDownloadBuild({ build, preview })

  return (
    <SidebarContainer>
      <BuildWorkspace.Root>
        <BuildWorkspace.Canvas>
          <BuildWorkspace.Content>
            <Show when={build.resonator.data}>
              {(resonator) => (
                <BuildWorkspaceStage>
                  <BuildWorkspacePreview
                    build={build}
                    resonatorId={resonator.id}
                    preview={preview}
                  />
                </BuildWorkspaceStage>
              )}
            </Show>
          </BuildWorkspace.Content>
        </BuildWorkspace.Canvas>
      </BuildWorkspace.Root>

      <Show when={exportSnapshot}>
        {(snapshot) => (
          <BuildExportCard {...snapshot} captureRef={captureRef} />
        )}
      </Show>
    </SidebarContainer>
  )
}
