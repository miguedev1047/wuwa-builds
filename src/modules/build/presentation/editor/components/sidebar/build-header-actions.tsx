import { useBuildCollection } from "@/modules/build/client/hooks/build-live-queries"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { useState } from "react"
import { Show } from "@/components/utility/show"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckIcon, DownloadIcon } from "@hugeicons/core-free-icons"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { updateBuild } from "@/modules/build/client/build-store"

type BuildHeaderActionsProps = {
  canDownload: boolean
  isDownloading: boolean
  onDownload: () => void
}

/** Rename and export actions for the active build. */
export function BuildHeaderActions({
  canDownload,
  isDownloading,
  onDownload,
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
            <InputGroup className="h-6 max-w-48">
              <InputGroupInput
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
              <InputGroupAddon align="inline-end">
                <InputGroupButton onClick={() => setIsEditing(false)}>
                  <HugeiconsIcon icon={CheckIcon} />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Show>

          <Button
            size="xs"
            disabled={!canDownload || isDownloading}
            onClick={onDownload}
          >
            <HugeiconsIcon icon={DownloadIcon} />
            {isDownloading ? "Exportando..." : "Exportar"}
          </Button>
        </div>
      )}
    </Show>
  )
}
