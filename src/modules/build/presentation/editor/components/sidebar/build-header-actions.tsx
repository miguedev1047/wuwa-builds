import { Button } from "@/components/panelui/button"
import { Input } from "@/components/panelui/input"
import { Show } from "@/components/utility/show"
import { updateBuild } from "@/modules/build/client/build-store"
import { useBuildCollection } from "@/modules/build/client/hooks/build-live-queries"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { CheckIcon, DownloadIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { BuildDelete } from "@build/presentation/editor/components/sidebar"

type BuildHeaderActionsProps = {
  canDownload: boolean
  isDownloading: boolean
  onDownload: () => void
  onDelete: () => void
}

/** Rename and export actions for the active build. */
export function BuildHeaderActions({
  canDownload,
  isDownloading,
  onDownload,
  onDelete,
}: BuildHeaderActionsProps) {
  const [isEditing, setIsEditing] = useState(false)

  const { buildId, sessionId } = useBuildIdentity()
  const { data } = useBuildCollection({ buildId, sessionId })

  const handleRenameBuild = (name: string) => {
    updateBuild({ buildId, sessionId }, (current) => {
      current.name = name
    })
  }

  return (
    <Show when={data}>
      {(build) => (
        <div className="flex w-full items-center justify-between">
          <Show
            when={isEditing}
            fallback={
              <h2
                className="text-sm"
                onDoubleClick={() => setIsEditing(!isEditing)}
              >
                {build.name}
              </h2>
            }
          >
            <Input.Group className="h-6 max-w-48">
              <Input
                autoFocus
                value={build.name}
                onBlur={() => setIsEditing(false)}
                onChange={(e) => handleRenameBuild(e.target.value)}
                placeholder="Nombre de la build"
                onKeyDown={(e) => {
                  const key = e.key
                  if (key === "Escape" || key === "Enter") {
                    setIsEditing(false)
                  }
                }}
              />
              <Input.Addon align="end">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Guardar nombre"
                  className="size-4"
                  onClick={() => setIsEditing(false)}
                >
                  <HugeiconsIcon icon={CheckIcon} />
                </Button>
              </Input.Addon>
            </Input.Group>
          </Show>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={!canDownload || isDownloading}
              onClick={onDownload}
            >
              <HugeiconsIcon icon={DownloadIcon} />
              {isDownloading ? "Exportando..." : "Exportar"}
            </Button>
            <BuildDelete onDelete={onDelete} />
          </div>
        </div>
      )}
    </Show>
  )
}
