import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import type { EchoSetRow } from "@db/schema"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteEchoSet } from "@catalog/server/echoes/sets"

type EchoSetDeleteActionProps = {
  echoId: number
  echoSet: EchoSetRow
}

export function EchoSetDeleteAction({
  echoSet,
  echoId,
}: EchoSetDeleteActionProps) {
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
