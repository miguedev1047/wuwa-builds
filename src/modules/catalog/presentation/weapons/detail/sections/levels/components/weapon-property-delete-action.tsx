import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteWeaponProperty } from "@catalog/server/weapons/properties"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type WeaponPropertyDeleteActionProps = {
  propertyId: number
  weaponId: number
}

/** Removes one base stat from the weapon after confirmation. */
export function WeaponPropertyDeleteAction({
  propertyId,
  weaponId,
}: WeaponPropertyDeleteActionProps) {
  const toast = useToast()

  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteWeaponProperty({ data: { id: propertyId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
    },
    onSuccess: () => {
      toast.add({ title: "Propiedad eliminada", type: "success" })
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const handleRemoveProperty = () => {
    if (!isValidId(propertyId)) return

    return mutateAsync()
  }

  return (
    <EditableSection.Action
      mode="destructive"
      title="Eliminar propiedad"
      description="Estas seguro que quieres eliminar esta propiedad? Esta accion es irreversible."
      onConfirm={handleRemoveProperty}
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
