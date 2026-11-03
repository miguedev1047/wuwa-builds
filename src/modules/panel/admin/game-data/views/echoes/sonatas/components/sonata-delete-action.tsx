import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import type { SonataSetRow } from "@/db/schema"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { deleteSonata } from "@/modules/panel/admin/game-data/server/echoes/sonatas"

type SonataDeleteActionProps = {
  sonata: SonataSetRow
}

export function SonataDeleteAction({ sonata }: SonataDeleteActionProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteSonata({ data: { id: sonata.id } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.sonatas(),
      })
      toast.success("Set de sonata eliminado")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <EditableSection.DeleteAction
      title="Eliminar set de sonata"
      description={`Estas seguro que quieres eliminar ${sonata.name}`}
      isPending={isPending}
      onConfirm={() => mutate()}
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="destructive"
          aria-label="Eliminar set de sonata"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </EditableSection.ButtonAction>
      }
    />
  )
}
