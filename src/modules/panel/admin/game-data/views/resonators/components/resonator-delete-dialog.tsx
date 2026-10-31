import { useParams } from "@tanstack/react-router"
import { useResonatorDialog } from "@/modules/panel/admin/game-data/views/resonators/stores/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import { DeleteIcon } from "@hugeicons/core-free-icons"

export function ResonatorDeleteDialog() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  const setIsOpen = useResonatorDialog((state) => state.setIsOpen)
  const close = useResonatorDialog((state) => state.close)
  const dialogType = useResonatorDialog((state) => state.type)
  const isOpen = useResonatorDialog(
    (state) => state.isOpen && dialogType === "delete"
  )

  const handleResonatorDelete = () => {
    if (!Number.isInteger(resonatorId) || resonatorId <= 0) return

    // TODO: delete the resonator and invalidate the list query.
    close()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <HugeiconsIcon icon={DeleteIcon} />
          </AlertDialogMedia>
          <AlertDialogTitle>Eliminar resonador</AlertDialogTitle>
          <AlertDialogDescription>
            Estas seguro que quieres eliminar este resonador
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleResonatorDelete}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
