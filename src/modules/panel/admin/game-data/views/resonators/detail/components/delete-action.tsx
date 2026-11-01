import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { isValidId } from "@/modules/panel/admin/game-data/application/id"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { deleteResonator } from "@/modules/panel/admin/game-data/server/characters"
import { useIsMobile } from "@/hooks/use-mobile"
import { Show } from "@/components/utility/show"

export function ResonatorDeleteAction() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const isMobile = useIsMobile()
  const resonatorId = Number(id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteResonator({ data: { id: resonatorId } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.characters(),
      })
      queryClient.removeQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.success("Resonador eliminado")

      await navigate({ to: "/admin/resonators" })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <EditableSection.DeleteAction
      title="Eliminar resonador"
      description="Estas seguro que quieres eliminar este resonador"
      isPending={isPending}
      onConfirm={() => {
        if (!isValidId(resonatorId)) return

        mutate()
      }}
      trigger={
        <Button
          type="button"
          variant="destructive"
          size={isMobile ? "icon-sm" : "sm"}
        >
          <HugeiconsIcon icon={DeleteIcon} />
          <Show when={!isMobile}>Eliminar</Show>
        </Button>
      }
    />
  )
}
