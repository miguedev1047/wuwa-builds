import { AlertDialog } from "@/components/panelui/alert-dialog"

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
      <AlertDialog.Content size="sm">
        <div>
          <AlertDialog.Title>¿Eliminar build?</AlertDialog.Title>
          <AlertDialog.Description>
            La build se eliminará de este navegador de forma permanente.
          </AlertDialog.Description>
        </div>
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
