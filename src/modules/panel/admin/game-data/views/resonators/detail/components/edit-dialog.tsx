import { useId } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import type { ResonatorRow } from "@/db/schema"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  resonatorInput,
  type ResonatorInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { updateResonator } from "@/modules/panel/admin/game-data/server/characters"
import { resonatorDraftFromRow } from "@/modules/panel/admin/game-data/views/resonators/shared/application/resonator-draft"
import { ResonatorFields } from "@/modules/panel/admin/game-data/views/resonators/shared/components/resonator-fields"
import { Skeleton } from "skullet/react"

type ResonatorEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResonatorEditDialog({
  open,
  onOpenChange,
}: ResonatorEditDialogProps) {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  const { data } = useQuery({
    ...characterQueries.detail(resonatorId),
    enabled: Number.isInteger(resonatorId) && resonatorId > 0,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Editar resonador</DialogTitle>
        </DialogHeader>

        <Skeleton data={data}>
          {(resonator) => (
            <ResonatorEditForm
              resonator={resonator}
              onSaved={() => onOpenChange(false)}
              onCancel={() => onOpenChange(false)}
            />
          )}
        </Skeleton>
      </DialogContent>
    </Dialog>
  )
}

type ResonatorEditFormProps = {
  resonator: ResonatorRow
  onSaved: () => void
  onCancel: () => void
}

function ResonatorEditForm({
  resonator,
  onSaved,
  onCancel,
}: ResonatorEditFormProps) {
  const formId = `edit-resonator-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorInput) => updateResonator({ data: value }),
    onSuccess: async (updated) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.characters(),
        }),
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.character(updated.id),
        }),
      ])

      toast.success("Resonador actualizado")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: resonatorDraftFromRow(resonator),
    validators: { onSubmit: resonatorInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return (
    <div className="space-y-6">
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="no-scrollbar max-h-[50vh] overflow-y-scroll"
      >
        <ResonatorFields form={form} isPending={isPending} />
      </form>

      <DialogFooter>
        <Button type="button" size="xl" variant="secondary" onClick={onCancel}>
          Cerrar
        </Button>
        <form.AppForm>
          <form.SubmitButton label="Guardar" formId={formId} />
        </form.AppForm>
      </DialogFooter>
    </div>
  )
}
