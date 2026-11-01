import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { isValidId } from "@/modules/panel/admin/game-data/application/id"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { deleteResonatorPropertyLevel } from "@/modules/panel/admin/game-data/server/property-levels"

type ResonatorPropertyLevelDeleteProps = {
  propertyLevelId: number
  resonatorId: number
}

/** Removes one property level from the resonator after confirmation. */
export function ResonatorPropertyLevelDelete({
  propertyLevelId,
  resonatorId,
}: ResonatorPropertyLevelDeleteProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      deleteResonatorPropertyLevel({ data: { id: propertyLevelId } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.success("Propiedad eliminada")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemoveLevel = () => {
    if (!isValidId(propertyLevelId)) return

    mutate()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="destructive"
            size="icon"
            aria-label="Eliminar propiedad"
            disabled={isPending}
          >
            <HugeiconsIcon icon={DeleteIcon} />
          </Button>
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desea eliminar este nivel?</AlertDialogTitle>
          <AlertDialogDescription>
            Estas seguro de eliminar este nivel? Esta accion es irreversible y
            no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>

          <AlertDialogAction disabled={isPending} onClick={handleRemoveLevel}>
            {isPending ? "Eliminando..." : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
