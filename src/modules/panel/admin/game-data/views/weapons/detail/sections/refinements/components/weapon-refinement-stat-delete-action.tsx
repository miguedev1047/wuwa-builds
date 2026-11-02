import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { isValidId } from "@/modules/panel/admin/game-data/application/id"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { deleteWeaponRefinementStat } from "@/modules/panel/admin/game-data/server/weapons/refinement-stats"

type WeaponRefinementStatDeleteActionProps = {
  statId: number
  weaponId: number
}

/** Removes one refinement stat after confirmation. */
export function WeaponRefinementStatDeleteAction({
  statId,
  weaponId,
}: WeaponRefinementStatDeleteActionProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteWeaponRefinementStat({ data: { id: statId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
    },
    onSuccess: () => {
      toast.success("Estadística eliminada")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemoveStat = () => {
    if (!isValidId(statId)) return

    mutate()
  }

  return (
    <EditableSection.DeleteAction
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
