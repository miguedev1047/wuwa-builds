import { Button } from "@/components/panelui/button"
import { Dialog } from "@/components/panelui/dialog"
import { Menu } from "@/components/panelui/menu"
import { Show } from "@/components/utility/show"
import { SonataFields } from "@catalog/presentation/sonatas/components/sonata-form-fields"
import { useSonataAddForm } from "@catalog/presentation/sonatas/hooks/sonata-add-form"
import { useSonataSync } from "@catalog/presentation/sonatas/hooks/use-sonata-sync"
import {
  CloudSyncIcon,
  MoreHorizontalIcon,
  PlusIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRef, useState } from "react"

/** Groups the mutation actions available from the sonata list. */
export function SonataListActions() {
  const [open, setOpen] = useState(false)
  const addRequested = useRef(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const sync = useSonataSync()
  const { formId, isPending, form, onCancel } = useSonataAddForm({
    onSaved: () => setOpen(false),
    onCancel: () => setOpen(false),
  })
  return (
    <>
      <Menu
        onOpenChangeComplete={(menuOpen) => {
          if (menuOpen || !addRequested.current) return
          addRequested.current = false
          form.reset()
          setOpen(true)
        }}
      >
        <Menu.Trigger
          render={
            <Button
              ref={menuButton}
              variant="secondary"
              size="icon"
              aria-label="Acciones de sonatas"
            />
          }
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} />
        </Menu.Trigger>
        <Menu.Content align="end">
          <Menu.Item
            onClick={() => {
              addRequested.current = true
            }}
          >
            <HugeiconsIcon icon={PlusIcon} />
            Agregar
          </Menu.Item>
          <Menu.Item disabled={sync.isPending} onClick={() => sync.mutate()}>
            <HugeiconsIcon icon={CloudSyncIcon} />
            <Show when={sync.isPending} fallback="Sincronizar">
              Sincronizando
            </Show>
          </Menu.Item>
        </Menu.Content>
      </Menu>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!isPending) setOpen(next)
        }}
        onOpenChangeComplete={(next) => {
          if (!next) menuButton.current?.focus()
        }}
      >
        <Dialog.Content size="lg">
          <Dialog.Header
            title="Nuevo set de sonata"
            description="Crea un set manual. Los sets de Encore llegan con la sincronización."
          />
          <Dialog.Body>
            <form
              id={formId}
              onSubmit={(event) => {
                event.preventDefault()
                void form.handleSubmit().catch(() => undefined)
              }}
            >
              <SonataFields form={form} isPending={isPending} />
            </form>
          </Dialog.Body>
          <Dialog.Footer>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isPending}
            >
              Cerrar
            </Button>

            <form.AppForm>
              <form.SubmitButton label="Crear" formId={formId} />
            </form.AppForm>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
