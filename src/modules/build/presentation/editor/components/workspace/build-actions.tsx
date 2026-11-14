import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  DeleteIcon,
  Download01Icon,
  EllipsisIcon,
  Image01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { BuildBackgrounds } from "./build-backgrounds-dialog"
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
  const [backgroundOpen, setBackgroundOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
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
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={!canDownload || isDownloading}
            onClick={onDownload}
          >
            <HugeiconsIcon icon={Download01Icon} />
            {isDownloading ? "Preparando PNG…" : "Descargar PNG"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBackgroundOpen(true)}>
            <HugeiconsIcon icon={Image01Icon} />
            Cambiar fondo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <HugeiconsIcon icon={DeleteIcon} />
            Eliminar build
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BuildBackgrounds
        open={backgroundOpen}
        onOpenChange={setBackgroundOpen}
      />

      <BuildDeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onDelete={onDelete}
      />
    </>
  )
}
