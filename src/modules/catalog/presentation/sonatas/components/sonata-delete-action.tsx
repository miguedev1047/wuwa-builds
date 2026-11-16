import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteSonata } from "@catalog/server/echoes/sonatas"
import type { SonataSetRow } from "@db/schema"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type SonataDeleteActionProps = {
  sonata: SonataSetRow
}

export function SonataDeleteAction({ sonata }: SonataDeleteActionProps) {
  const toast = useToast()

  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteSonata({ data: { id: sonata.id } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.sonatas(),
      })
      toast.add({ title: "Set de sonata eliminado", type: "success" })
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  return (
    <EditableSection.Action
      mode="destructive"
      title="Eliminar set de sonata"
      description={`Estas seguro que quieres eliminar ${sonata.name}`}
      isPending={isPending}
      onConfirm={() => mutateAsync()}
      trigger={
        <Button
          type="button"
          variant="destructive"
          size="icon"
          aria-label="Eliminar set de sonata"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      }
    />
  )
}
