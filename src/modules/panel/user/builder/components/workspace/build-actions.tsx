import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"

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

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar build?</AlertDialogTitle>
            <AlertDialogDescription>
              La build se eliminará de este navegador de forma permanente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
