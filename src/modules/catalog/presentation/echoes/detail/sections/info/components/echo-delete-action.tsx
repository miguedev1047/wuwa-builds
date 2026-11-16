import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { isValidId } from "@catalog/application/id"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteEcho } from "@catalog/server/echoes/echoes"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function EchoDeleteAction({ echoId }: { echoId: number }) {
  const toast = useToast()

  const queryClient = useQueryClient()
  const { onDeleted } = useCatalogActions()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteEcho({ data: { id: echoId } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.echoes(),
      })
      queryClient.removeQueries({
        queryKey: wuwaBuildsKeys.echo(echoId),
      })
      toast.add({ title: "Eco eliminado", type: "success" })

      await onDeleted()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const handleRemoveEcho = () => {
    if (!isValidId(echoId)) return

    return mutateAsync()
  }

  return (
    <EditableSection.Action
      mode="destructive"
      title="Eliminar eco"
      description="Estas seguro que quieres eliminar este eco"
      isPending={isPending}
      onConfirm={handleRemoveEcho}
      trigger={
        <Button
          type="button"
          variant="destructive"
          size="icon"
          aria-label="Eliminar eco"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      }
    />
  )
}
