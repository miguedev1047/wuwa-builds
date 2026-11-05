import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useParams } from "@tanstack/react-router"
import { toast } from "sonner"
import type { EchoSetRow } from "@/db/schema"
import { isValidId } from "@/modules/game-data/application/id"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { wuwaBuildsKeys } from "@/modules/game-data/queries/keys"
import { deleteEchoSet } from "@/modules/game-data/server/echoes/sets"

type EchoSetDeleteActionProps = {
  echoSet: EchoSetRow
}

export function EchoSetDeleteAction({ echoSet }: EchoSetDeleteActionProps) {
  const { id } = useParams({ from: "/(panel)/admin/echoes/$id" })
  const echoId = Number(id)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteEchoSet({ data: { id: echoSet.id } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.echo(echoId),
      })
      toast.success("Set eliminado del eco")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemove = () => {
    if (!isValidId(echoSet.id)) return

    mutate()
  }

  return (
    <EditableSection.DeleteAction
      title="Quitar set"
      description={`Estas seguro que quieres quitar ${echoSet.name} de este eco`}
      isPending={isPending}
      onConfirm={handleRemove}
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="destructive"
          aria-label="Quitar set del eco"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </EditableSection.ButtonAction>
      }
    />
  )
}
