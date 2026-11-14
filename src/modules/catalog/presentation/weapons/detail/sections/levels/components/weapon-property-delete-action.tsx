import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteWeaponProperty } from "@catalog/server/weapons/properties"

type WeaponPropertyDeleteActionProps = {
  propertyId: number
  weaponId: number
}

/** Removes one base stat from the weapon after confirmation. */
export function WeaponPropertyDeleteAction({
  propertyId,
  weaponId,
}: WeaponPropertyDeleteActionProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteWeaponProperty({ data: { id: propertyId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
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
    if (!isValidId(propertyId)) return

    mutate()
  }

  return (
    <EditableSection.DeleteAction
      title="Eliminar propiedad"
      description="Estas seguro que quieres eliminar esta propiedad? Esta accion es irreversible."
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
