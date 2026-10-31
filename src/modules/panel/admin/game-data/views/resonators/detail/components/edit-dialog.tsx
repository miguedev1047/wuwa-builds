import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useId } from "react"
import { useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "skullet/react"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Editar resonador</DialogTitle>
        </DialogHeader>

        <Skeleton data={data} skeleton={<div className="h-40" />}>
          {(resonator) => (
            <form
              id={formId}
              className="no-scrollbar max-h-[40vh] w-full space-y-4 overflow-y-scroll"
            >
              {/* TODO: campos del formulario de edición */}
              <Input value={resonator.name} readOnly />
            </form>
          )}
        </Skeleton>

        <DialogFooter>
          <DialogClose render={<Button>Cerrar</Button>} />
          <Button type="submit" form={formId}>
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
