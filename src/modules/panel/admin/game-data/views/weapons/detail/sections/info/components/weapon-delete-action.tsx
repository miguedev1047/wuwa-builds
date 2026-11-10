import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { isValidId } from "@game-data/application/id"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { wuwaBuildsKeys } from "@game-data/queries/keys"
import { deleteWeapon } from "@game-data/server/weapons/weapons"

export function WeaponDeleteAction() {
  const { id } = useParams({ from: "/(panel)/admin/weapons/$id" })
  const weaponId = Number(id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

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

      await navigate({ to: "/admin/weapons" })
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
