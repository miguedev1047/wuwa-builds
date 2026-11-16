import { Button } from "@/components/panelui/button"
import { Menu } from "@/components/panelui/menu"
import { Spinner } from "@/components/panelui/spinner"
import {
  DeleteIcon,
  Download01Icon,
  EllipsisIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { BuildDeleteDialog } from "./build-delete-dialog"

type BuildActionsProps = {
  canDownload: boolean
  isDownloading: boolean
  onDownload: () => void
  onDelete: () => void
}

/** Download and delete actions for the current build. */
export function BuildActions({
  canDownload,
  isDownloading,
  onDownload,
  onDelete,
}: BuildActionsProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <>
      <Menu>
        <Menu.Trigger
          render={
            <Button
              size="icon"
              variant="ghost"
              aria-label="Acciones de la build"
              disabled={isDownloading}
            />
          }
        >
          {isDownloading ? <Spinner /> : <HugeiconsIcon icon={EllipsisIcon} />}
        </Menu.Trigger>
        <Menu.Content align="end">
          <Menu.Item
            disabled={!canDownload || isDownloading}
            onClick={onDownload}
          >
            <HugeiconsIcon icon={Download01Icon} />
            {isDownloading ? "Preparando PNG…" : "Descargar PNG"}
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item
            variant="destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <HugeiconsIcon icon={DeleteIcon} />
            Eliminar build
          </Menu.Item>
        </Menu.Content>
      </Menu>

      <BuildDeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onDelete={onDelete}
      />
    </>
  )
}
