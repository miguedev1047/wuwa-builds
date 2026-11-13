import { useRef, useState, type ReactElement } from "react"
import { flushSync } from "react-dom"
import { toast } from "sonner"
import { downloadBuildPng } from "@builder/application/download-build-png"
import { BuildExportCard } from "@builder/components/workspace/build-export-card"
import { useBuildStats } from "@panel/user/builds/application/use-build-stats"
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
  const preview = useBuildStats(build)
  const [exportSnapshot, setExportSnapshot] = useState<{
    build: BuildProps
    preview: ReturnType<typeof useBuildStats>
  } | null>(null)
  const captureRef = useRef<HTMLDivElement>(null)
  const canDownload =
    !!preview.resonator &&
    !!preview.result &&
    !preview.isLoading &&
    !preview.isError

  const handleDownload = async () => {
    if (!canDownload || captureRef.current) return

    try {
      flushSync(() => setExportSnapshot({ build, preview }))
      const card = captureRef.current
      if (!card) throw new Error("Export card did not mount")
      await downloadBuildPng(card, build.name)
    } catch {
      toast.error("No se pudo descargar la imagen de la build")
    } finally {
      setExportSnapshot(null)
    }
  }

  return (
    <div className="container mx-auto flex min-h-dvh w-full flex-col gap-6 p-3 md:p-6 xl:h-dvh xl:overflow-hidden">
      <BuildHeader
        name={build.name}
        backLink={backLink}
        onRename={onRename}
        canDownload={canDownload}
        isDownloading={exportSnapshot !== null}
        onDownload={handleDownload}
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
                    preview={preview}
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

      <Show when={exportSnapshot}>
        {(snapshot) => (
          <BuildExportCard {...snapshot} captureRef={captureRef} />
        )}
      </Show>
    </div>
  )
}
