import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { isValidId } from "@/modules/panel/admin/game-data/application/id"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { deleteResonatorSequence } from "@/modules/panel/admin/game-data/server/sequences"

type ResonatorSequenceDeleteActionProps = {
  sequenceId: number
  resonatorId: number
}

/** Removes one sequence from the resonator after confirmation. */
export function ResonatorSequenceDeleteAction({
  sequenceId,
  resonatorId,
}: ResonatorSequenceDeleteActionProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteResonatorSequence({ data: { id: sequenceId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
    },
    onSuccess: () => {
      toast.success("Secuencia eliminada")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemoveSequence = () => {
    if (!isValidId(sequenceId)) return

    mutate()
  }

  return (
    <EditableSection.DeleteAction
      title="Eliminar secuencia"
      description="Estas seguro que quieres eliminar esta secuencia? Esta accion es irreversible."
      isPending={isPending}
      onConfirm={handleRemoveSequence}
      trigger={
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          aria-label="Eliminar secuencia"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      }
    />
  )
}
