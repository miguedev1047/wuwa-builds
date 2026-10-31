import { useEffect, useId } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useAppForm } from "@/components/form"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { resonatorInput } from "@/modules/panel/admin/game-data/application/schemas"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { resonatorDraftFromRow } from "@/modules/panel/admin/game-data/views/resonators/shared/application/resonator-draft"
import {
  ResonatorFields,
  resonatorFormDefaults,
} from "@/modules/panel/admin/game-data/views/resonators/shared/components/resonator-fields"

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

  const formId = `edit-resonator-form-${useId()}`

  const { data } = useQuery({
    ...characterQueries.detail(resonatorId),
    enabled: Number.isInteger(resonatorId) && resonatorId > 0,
  })

  const form = useAppForm({
    formId,
    defaultValues: resonatorFormDefaults,
    validators: { onSubmit: resonatorInput },
    onSubmit: async () => {
      // TODO: call the update server function and invalidate the detail query.
    },
  })

  useEffect(() => {
    if (!data) return

    form.reset(resonatorDraftFromRow(data))
  }, [data, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Editar resonador</DialogTitle>
        </DialogHeader>

        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
          className="no-scrollbar max-h-[50vh] overflow-y-scroll"
        >
          {/* TODO: pass the update mutation's `isPending` here. */}
          <ResonatorFields form={form} />
        </form>

        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cerrar</Button>} />
          <form.AppForm>
            <form.SubmitButton label="Guardar" formId={formId} />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
