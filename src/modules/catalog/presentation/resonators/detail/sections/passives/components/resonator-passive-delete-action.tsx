import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteResonatorPassive } from "@catalog/server/resonators/passives"

type ResonatorPassiveDeleteActionProps = {
  passiveId: number
  resonatorId: number
}

/** Removes one passive from the resonator after confirmation. */
export function ResonatorPassiveDeleteAction({
  passiveId,
  resonatorId,
}: ResonatorPassiveDeleteActionProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteResonatorPassive({ data: { id: passiveId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
    },
    onSuccess: () => {
      toast.success("Pasiva eliminada")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemovePassive = () => {
    if (!isValidId(passiveId)) return

    mutate()
  }

  return (
    <EditableSection.DeleteAction
      title="Eliminar pasiva"
      description="Estas seguro que quieres eliminar esta pasiva? Esta accion es irreversible."
      isPending={isPending}
      onConfirm={handleRemovePassive}
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="destructive"
          aria-label="Eliminar pasiva"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </EditableSection.ButtonAction>
      }
    />
  )
}
