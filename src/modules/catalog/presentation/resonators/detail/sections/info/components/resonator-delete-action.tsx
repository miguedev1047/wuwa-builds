import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteResonator } from "@catalog/server/resonators/resonators"

export function ResonatorDeleteAction({
  resonatorId,
}: {
  resonatorId: number
}) {
  const queryClient = useQueryClient()
  const { onDeleted } = useCatalogActions()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteResonator({ data: { id: resonatorId } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.characters(),
      })
      queryClient.removeQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.success("Resonador eliminado")

      await onDeleted()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemoveResonator = () => {
    if (!isValidId(resonatorId)) return

    mutate()
  }

  return (
    <EditableSection.DeleteAction
      title="Eliminar resonador"
      description="Estas seguro que quieres eliminar este resonador"
      isPending={isPending}
      onConfirm={handleRemoveResonator}
      trigger={
        <EditableSection.ButtonAction type="button" variant="destructive">
          <HugeiconsIcon icon={DeleteIcon} />
        </EditableSection.ButtonAction>
      }
    />
  )
}
