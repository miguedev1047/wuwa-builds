import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { toast } from "sonner"
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
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { deleteResonator } from "@/modules/panel/admin/game-data/server/characters"

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
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteResonator({ data: { id: resonatorId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.characters(),
      })
      queryClient.removeQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
    },
    onSuccess: () => {
      toast.success("Resonador eliminado")
      onOpenChange(false)
      navigate({ to: "/admin/resonators" })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleResonatorDelete = () => {
    if (!Number.isInteger(resonatorId) || resonatorId <= 0) return
    mutate()
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
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleResonatorDelete}
          >
            {isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
