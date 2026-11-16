import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteResonatorPropertyGrowth } from "@catalog/server/resonators/property-growth"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type PropertyGrowthDeleteActionProps = {
  growthId: number
  resonatorId: number
}

/** Removes one growth entry after confirmation. */
export function PropertyGrowthDeleteAction({
  growthId,
  resonatorId,
}: PropertyGrowthDeleteActionProps) {
  const toast = useToast()

  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteResonatorPropertyGrowth({ data: { id: growthId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
    },
    onSuccess: () => {
      toast.add({ title: "Nivel eliminado", type: "success" })
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const handleRemoveGrowth = () => {
    if (!isValidId(growthId)) return

    return mutateAsync()
  }

  return (
    <EditableSection.Action
      mode="destructive"
      title="Eliminar nivel"
      description="Estas seguro que quieres eliminar este nivel? Esta accion es irreversible."
      isPending={isPending}
      onConfirm={handleRemoveGrowth}
      trigger={
        <Button
          type="button"
          variant="destructive"
          size="icon"
          aria-label="Eliminar nivel"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      }
    />
  )
}
