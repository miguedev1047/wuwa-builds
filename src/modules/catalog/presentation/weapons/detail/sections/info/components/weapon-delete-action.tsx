import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { isValidId } from "@catalog/application/id"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteWeapon } from "@catalog/server/weapons/weapons"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function WeaponDeleteAction({ weaponId }: { weaponId: number }) {
  const toast = useToast()

  const queryClient = useQueryClient()
  const { onDeleted } = useCatalogActions()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteWeapon({ data: { id: weaponId } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapons(),
      })
      queryClient.removeQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
      toast.add({ title: "Arma eliminada", type: "success" })

      await onDeleted()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const handleRemoveWeapon = () => {
    if (!isValidId(weaponId)) return

    return mutateAsync()
  }

  return (
    <EditableSection.Action
      mode="destructive"
      title="Eliminar arma"
      description="Estas seguro que quieres eliminar esta arma"
      isPending={isPending}
      onConfirm={handleRemoveWeapon}
      trigger={
        <Button
          type="button"
          variant="destructive"
          size="icon"
          aria-label="Eliminar arma"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      }
    />
  )
}
