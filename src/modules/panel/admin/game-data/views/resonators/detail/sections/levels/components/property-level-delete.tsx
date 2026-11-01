import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { isValidId } from "@/modules/panel/admin/game-data/application/id"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { deleteResonatorPropertyLevel } from "@/modules/panel/admin/game-data/server/property-levels"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"

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

  const handleRemoveLevel = () => {
    if (!isValidId(propertyLevelId)) return
    mutate()
  }

  return (
    <EditableSection.DeleteAction
      title="Eliminar propiedad. Esta accion es irreversible."
      description="Estas seguro que quieres eliminar esta propiedad. Esta accion es irreversible."
      onConfirm={handleRemoveLevel}
      isPending={isPending}
      trigger={
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
  )
}
