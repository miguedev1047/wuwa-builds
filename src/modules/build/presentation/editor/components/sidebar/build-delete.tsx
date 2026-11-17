import { AlertDialog } from "@/components/panelui/alert-dialog"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type BuildDeleteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
}

/** Confirms and deletes the build currently open in the editor. */
export function BuildDelete({
  open,
  onOpenChange,
  onDelete,
}: BuildDeleteProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content tone="destructive" size="sm">
        <AlertDialog.Media>
          <HugeiconsIcon icon={DeleteIcon} />
        </AlertDialog.Media>
        <AlertDialog.Title>¿Eliminar esta build?</AlertDialog.Title>
        <AlertDialog.Description>
          Se eliminarán permanentemente la build y toda su configuración. Esta
          acción no se puede deshacer.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel title="Cancelar" />
          <AlertDialog.Action onClick={onDelete}>Eliminar</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  )
}
