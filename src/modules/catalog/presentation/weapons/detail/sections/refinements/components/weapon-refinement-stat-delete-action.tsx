import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteWeaponRefinementStat } from "@catalog/server/weapons/refinement-stats"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type WeaponRefinementStatDeleteActionProps = {
  statId: number
  weaponId: number
}

/** Removes one refinement stat after confirmation. */
export function WeaponRefinementStatDeleteAction({
  statId,
  weaponId,
}: WeaponRefinementStatDeleteActionProps) {
  const toast = useToast()

  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteWeaponRefinementStat({ data: { id: statId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
    },
    onSuccess: () => {
      toast.add({ title: "Estadística eliminada", type: "success" })
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const handleRemoveStat = () => {
    if (!isValidId(statId)) return

    return mutateAsync()
  }

  return (
    <EditableSection.Action
      mode="destructive"
      title="Eliminar estadística"
      description="Estas seguro que quieres eliminar esta estadística? Esta accion es irreversible."
      isPending={isPending}
      onConfirm={handleRemoveStat}
      trigger={
        <Button
          type="button"
          variant="destructive"
          size="icon"
          aria-label="Eliminar estadística"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      }
    />
  )
}
