import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteWeapon } from "@catalog/server/weapons/weapons"

export function WeaponDeleteAction({ weaponId }: { weaponId: number }) {
  const queryClient = useQueryClient()
  const { onDeleted } = useCatalogActions()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteWeapon({ data: { id: weaponId } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapons(),
      })
      queryClient.removeQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
      toast.success("Arma eliminada")

      await onDeleted()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemoveWeapon = () => {
    if (!isValidId(weaponId)) return

    mutate()
  }

  return (
    <EditableSection.DeleteAction
      title="Eliminar arma"
      description="Estas seguro que quieres eliminar esta arma"
      isPending={isPending}
      onConfirm={handleRemoveWeapon}
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="destructive"
          aria-label="Eliminar arma"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </EditableSection.ButtonAction>
      }
    />
  )
}
