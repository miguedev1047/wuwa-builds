import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteEchoSet } from "@catalog/server/echoes/sets"
import type { EchoSetRow } from "@db/schema"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type EchoSetDeleteActionProps = {
  echoId: number
  echoSet: EchoSetRow
}

export function EchoSetDeleteAction({
  echoSet,
  echoId,
}: EchoSetDeleteActionProps) {
  const toast = useToast()

  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteEchoSet({ data: { id: echoSet.id } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.echo(echoId),
      })
      toast.add({ title: "Set eliminado del eco", type: "success" })
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const handleRemove = () => {
    if (!isValidId(echoSet.id)) return

    return mutateAsync()
  }

  return (
    <EditableSection.Action
      mode="destructive"
      title="Quitar set"
      description={`Estas seguro que quieres quitar ${echoSet.name} de este eco`}
      isPending={isPending}
      onConfirm={handleRemove}
      trigger={
        <Button
          type="button"
          variant="destructive"
          size="icon"
          aria-label="Quitar set del eco"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      }
    />
  )
}
