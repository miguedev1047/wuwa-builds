import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteResonatorPassive } from "@catalog/server/resonators/passives"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type ResonatorPassiveDeleteActionProps = {
  passiveId: number
  resonatorId: number
}

/** Removes one passive from the resonator after confirmation. */
export function ResonatorPassiveDeleteAction({
  passiveId,
  resonatorId,
}: ResonatorPassiveDeleteActionProps) {
  const toast = useToast()

  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteResonatorPassive({ data: { id: passiveId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
    },
    onSuccess: () => {
      toast.add({ title: "Pasiva eliminada", type: "success" })
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const handleRemovePassive = () => {
    if (!isValidId(passiveId)) return

    return mutateAsync()
  }

  return (
    <EditableSection.Action
      mode="destructive"
      title="Eliminar pasiva"
      description="Estas seguro que quieres eliminar esta pasiva? Esta accion es irreversible."
      isPending={isPending}
      onConfirm={handleRemovePassive}
      trigger={
        <Button
          type="button"
          variant="destructive"
          size="icon"
          aria-label="Eliminar pasiva"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      }
    />
  )
}
