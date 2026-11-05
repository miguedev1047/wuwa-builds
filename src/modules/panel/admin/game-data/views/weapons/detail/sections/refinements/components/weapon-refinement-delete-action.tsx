import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { isValidId } from "@/modules/game-data/application/id"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { wuwaBuildsKeys } from "@/modules/game-data/queries/keys"
import { deleteWeaponRefinement } from "@/modules/game-data/server/weapons/refinements"

type WeaponRefinementDeleteActionProps = {
  refinementId: number
  weaponId: number
}

/** Removes one refinement and its stats after confirmation. */
export function WeaponRefinementDeleteAction({
  refinementId,
  weaponId,
}: WeaponRefinementDeleteActionProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteWeaponRefinement({ data: { id: refinementId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
    },
    onSuccess: () => {
      toast.success("Refinamiento eliminado")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemoveRefinement = () => {
    if (!isValidId(refinementId)) return

    mutate()
  }

  return (
    <EditableSection.DeleteAction
      title="Eliminar refinamiento"
      description="Estas seguro que quieres eliminar este refinamiento? Esta accion es irreversible."
      isPending={isPending}
      onConfirm={handleRemoveRefinement}
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="destructive"
          aria-label="Eliminar refinamiento"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </EditableSection.ButtonAction>
      }
    />
  )
}
