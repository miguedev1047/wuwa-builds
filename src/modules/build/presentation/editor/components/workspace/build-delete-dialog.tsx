import { AlertDialog } from "@/components/panelui/alert-dialog"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type BuildDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
}

/** Confirmation dialog for deleting the current build. */
export function BuildDeleteDialog({
  open,
  onOpenChange,
  onDelete,
}: BuildDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content tone="destructive" size="sm">
        <AlertDialog.Media>
          <HugeiconsIcon icon={DeleteIcon} />
        </AlertDialog.Media>
        <AlertDialog.Title>¿Eliminar build?</AlertDialog.Title>
        <AlertDialog.Description>
          La build se eliminará de este navegador de forma permanente.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
          <AlertDialog.Action tone="destructive" onClick={onDelete}>
            Eliminar
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  )
}
