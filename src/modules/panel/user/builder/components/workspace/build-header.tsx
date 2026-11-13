import { Button } from "@/components/ui/button"
import { BuildDelete } from "@builder/components/workspace/build-delete"
import { BuildName } from "@builder/components/workspace/build-name"
import type { ReactElement } from "react"

/** Header controls of the builder workspace. */
export function BuildHeader({
  name,
  backLink,
  onRename,
  onDelete,
}: {
  name: string
  backLink: ReactElement
  onRename: (name: string) => void
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
      <BuildDelete onDelete={onDelete} />
    </div>
  )
}
