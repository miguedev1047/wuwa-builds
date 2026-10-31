import { useParams } from "@tanstack/react-router"
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

type ResonatorDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResonatorDeleteDialog({
  open,
  onOpenChange,
}: ResonatorDeleteDialogProps) {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  const handleResonatorDelete = () => {
    if (!Number.isInteger(resonatorId) || resonatorId <= 0) return

    // TODO: delete the resonator and invalidate the list query.
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
