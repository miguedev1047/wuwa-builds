import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteWeaponPropertyGrowth } from "@catalog/server/weapons/property-growth"

type WeaponGrowthDeleteActionProps = {
  growthId: number
  weaponId: number
}

/** Removes one growth entry after confirmation. */
export function WeaponGrowthDeleteAction({
  growthId,
  weaponId,
}: WeaponGrowthDeleteActionProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteWeaponPropertyGrowth({ data: { id: growthId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
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
