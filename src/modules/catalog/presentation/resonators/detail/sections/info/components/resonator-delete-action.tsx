import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { isValidId } from "@catalog/application/id"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteResonator } from "@catalog/server/resonators/resonators"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function ResonatorDeleteAction({
  resonatorId,
}: {
  resonatorId: number
}) {
  const toast = useToast()

  const queryClient = useQueryClient()
  const { onDeleted } = useCatalogActions()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteResonator({ data: { id: resonatorId } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.characters(),
      })
      queryClient.removeQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.add({ title: "Resonador eliminado", type: "success" })

      await onDeleted()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const handleRemoveResonator = () => {
    if (!isValidId(resonatorId)) return

    return mutateAsync()
  }

  return (
    <EditableSection.Action
      mode="destructive"
      title="Eliminar resonador"
      description="Estas seguro que quieres eliminar este resonador"
      isPending={isPending}
      onConfirm={handleRemoveResonator}
      trigger={
        <Button size="icon" type="button" variant="destructive">
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      }
    />
  )
}
