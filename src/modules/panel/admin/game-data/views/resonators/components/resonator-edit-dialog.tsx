import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useResonatorDialog } from "@/modules/panel/admin/game-data/views/resonators/stores/dialog"
import { Button } from "@/components/ui/button"
import { useId } from "react"
import { useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { Skeleton } from "skullet/react"
import { Input } from "@/components/ui/input"

export function ResonatorEditDialog() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  const formId = `edit-resonator-form-${useId()}`

  const setIsOpen = useResonatorDialog((state) => state.setIsOpen)
  const dialogType = useResonatorDialog((state) => state.type)
  const isOpen = useResonatorDialog(
    (state) => state.isOpen && dialogType === "edit"
  )

  const { data } = useQuery({
    ...characterQueries.detail(resonatorId),
    enabled: Number.isInteger(resonatorId) && resonatorId > 0,
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
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
