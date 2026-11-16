import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteWeaponRefinement } from "@catalog/server/weapons/refinements"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type WeaponRefinementDeleteActionProps = {
  refinementId: number
  weaponId: number
}

/** Removes one refinement and its stats after confirmation. */
export function WeaponRefinementDeleteAction({
  refinementId,
  weaponId,
}: WeaponRefinementDeleteActionProps) {
  const toast = useToast()

  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteWeaponRefinement({ data: { id: refinementId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
    },
    onSuccess: () => {
      toast.add({ title: "Refinamiento eliminado", type: "success" })
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const handleRemoveRefinement = () => {
    if (!isValidId(refinementId)) return

    return mutateAsync()
  }

  return (
    <EditableSection.Action
      mode="destructive"
      title="Eliminar refinamiento"
      description="Estas seguro que quieres eliminar este refinamiento? Esta accion es irreversible."
      isPending={isPending}
      onConfirm={handleRemoveRefinement}
      trigger={
        <Button
          type="button"
          variant="destructive"
          size="icon"
          aria-label="Eliminar refinamiento"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      }
    />
  )
}
