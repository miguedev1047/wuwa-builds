import { Button } from "@/components/ui/button"
import { BuildActions } from "@build/presentation/editor/components/workspace/build-actions"
import { BuildName } from "@build/presentation/editor/components/workspace/build-name"
import type { ReactElement } from "react"

/** Header controls of the builder workspace. */
export function BuildHeader({
  name,
  backLink,
  onRename,
  canDownload,
  isDownloading,
  onDownload,
  onDelete,
}: {
  name: string
  backLink: ReactElement
  onRename: (name: string) => void
  canDownload: boolean
  isDownloading: boolean
  onDownload: () => void
  onDelete: () => void
}) {
  return (
    <div className="relative z-40 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button nativeButton={false} render={backLink}>
          Volver
        </Button>
      </div>

      <BuildName name={name} onRename={onRename} />

      <BuildActions
        canDownload={canDownload}
        isDownloading={isDownloading}
        onDownload={onDownload}
        onDelete={onDelete}
      />
    </div>
  )
}
