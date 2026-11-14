import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { isValidId } from "@catalog/application/id"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteResonatorPropertyLevel } from "@catalog/server/resonators/properties"
import { EditableSection } from "@catalog/presentation/components/editable-section"

type PropertyLevelDeleteActionProps = {
  propertyLevelId: number
  resonatorId: number
}

/** Removes one base stat from the resonator after confirmation. */
export function PropertyLevelDeleteAction({
  propertyLevelId,
  resonatorId,
}: PropertyLevelDeleteActionProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      deleteResonatorPropertyLevel({ data: { id: propertyLevelId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
    },
    onSuccess: () => {
      toast.success("Propiedad eliminada")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemoveProperty = () => {
    if (!isValidId(propertyLevelId)) return
    mutate()
  }

  return (
    <EditableSection.DeleteAction
      title="Eliminar propiedad. Esta accion es irreversible."
      description="Estas seguro que quieres eliminar esta propiedad. Esta accion es irreversible."
      onConfirm={handleRemoveProperty}
      isPending={isPending}
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="destructive"
          aria-label="Eliminar propiedad"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </EditableSection.ButtonAction>
      }
    />
  )
}
