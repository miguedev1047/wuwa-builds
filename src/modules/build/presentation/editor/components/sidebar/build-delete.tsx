import { AlertDialog } from "@/components/panelui/alert-dialog"
import { Button } from "@/components/panelui/button"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type BuildDeleteProps = {
  onDelete: () => void
}

/** Confirms and deletes the build currently open in the editor. */
export function BuildDelete({ onDelete }: BuildDeleteProps) {
  return (
    <AlertDialog>
      <AlertDialog.Trigger
        render={
          <Button size="icon-sm" variant="destructive">
            <HugeiconsIcon icon={DeleteIcon} />
          </Button>
        }
      />
      <AlertDialog.Content tone="destructive">
        <AlertDialog.Media>
          <HugeiconsIcon icon={DeleteIcon} />
        </AlertDialog.Media>
        <AlertDialog.Title>¿Eliminar esta build?</AlertDialog.Title>
        <AlertDialog.Description>
          Se eliminarán permanentemente la build y toda su configuración,
          incluidos el resonador, el arma y los ecos. Esta acción no se puede
          deshacer.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel title="Cancelar" />
          <AlertDialog.Action onClick={onDelete}>Eliminar</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  )
}
