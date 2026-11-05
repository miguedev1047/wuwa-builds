import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { isValidId } from "@/modules/game-data/application/id"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { wuwaBuildsKeys } from "@/modules/game-data/queries/keys"
import { deleteEcho } from "@/modules/game-data/server/echoes/echoes"

export function EchoDeleteAction() {
  const { id } = useParams({ from: "/(panel)/admin/echoes/$id" })
  const echoId = Number(id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteEcho({ data: { id: echoId } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.echoes(),
      })
      queryClient.removeQueries({
        queryKey: wuwaBuildsKeys.echo(echoId),
      })
      toast.success("Eco eliminado")

      await navigate({ to: "/admin/echoes" })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemoveEcho = () => {
    if (!isValidId(echoId)) return

    mutate()
  }

  return (
    <EditableSection.DeleteAction
      title="Eliminar eco"
      description="Estas seguro que quieres eliminar este eco"
      isPending={isPending}
      onConfirm={handleRemoveEcho}
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="destructive"
          aria-label="Eliminar eco"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </EditableSection.ButtonAction>
      }
    />
  )
}
