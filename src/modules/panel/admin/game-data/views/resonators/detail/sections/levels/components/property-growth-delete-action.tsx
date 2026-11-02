import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { isValidId } from "@/modules/panel/admin/game-data/application/id"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { deleteResonatorPropertyGrowth } from "@/modules/panel/admin/game-data/server/resonators/property-growth"

type PropertyGrowthDeleteActionProps = {
  growthId: number
  resonatorId: number
}

/** Removes one growth entry after confirmation. */
export function PropertyGrowthDeleteAction({
  growthId,
  resonatorId,
}: PropertyGrowthDeleteActionProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteResonatorPropertyGrowth({ data: { id: growthId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
    },
    onSuccess: () => {
      toast.success("Nivel eliminado")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemoveGrowth = () => {
    if (!isValidId(growthId)) return

    mutate()
  }

  return (
    <EditableSection.DeleteAction
      title="Eliminar nivel"
      description="Estas seguro que quieres eliminar este nivel? Esta accion es irreversible."
      isPending={isPending}
      onConfirm={handleRemoveGrowth}
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="destructive"
          aria-label="Eliminar nivel"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </EditableSection.ButtonAction>
      }
    />
  )
}
