import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteEcho } from "@catalog/server/echoes/echoes"

export function EchoDeleteAction({ echoId }: { echoId: number }) {
  const queryClient = useQueryClient()
  const { onDeleted } = useCatalogActions()

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

      await onDeleted()
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
