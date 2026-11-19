import { AlertDialog } from "@/components/panelui/alert-dialog"
import { Dialog } from "@/components/panelui/dialog"
import { Show } from "@/components/utility/show"
import { actionTrigger } from "@catalog/presentation/components/editable-section/components/editable-section-action-trigger"
import type { EditableSectionActionProps } from "@/modules/catalog/presentation/components/editable-section/types"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

/** A direct action, form dialog or asynchronous destructive confirmation. */
export function EditableSectionAction(props: EditableSectionActionProps) {
  const [internalOpen, setInternalOpen] = useState(
    "defaultOpen" in props ? (props.defaultOpen ?? false) : false
  )
  const open = "open" in props ? props.open : undefined
  const changeOpen = (next: boolean) => {
    if (props.isPending) return
    // A press can ask for the state it is already in; reporting it again would
    // reset a form the caller has open.
    if ((open ?? internalOpen) === next) return
    setInternalOpen(next)
    if ("onOpenChange" in props) props.onOpenChange?.(next)
  }

  const close = () => changeOpen(false)
  const trigger = actionTrigger(props)

  if (props.onClick) return trigger
  if (props.mode === "destructive" && typeof props.onConfirm === "function") {
    return (
      <AlertDialog open={open ?? internalOpen} onOpenChange={changeOpen}>
        <AlertDialog.Trigger render={trigger} />
        <AlertDialog.Content
          tone="destructive"
          size="sm"
          {...props.contentProps}
        >
          <AlertDialog.Media>
            <HugeiconsIcon icon={DeleteIcon} />
          </AlertDialog.Media>
          <AlertDialog.Title>{props.title}</AlertDialog.Title>
          <Show when={props.description}>
            <AlertDialog.Description>
              {props.description}
            </AlertDialog.Description>
          </Show>
          <AlertDialog.Footer>
            <AlertDialog.Cancel disabled={props.isPending}>
              {props.cancelLabel ?? "Cancelar"}
            </AlertDialog.Cancel>
            <AlertDialog.Action
              loading={props.isPending}
              onClick={props.onConfirm}
            >
              {props.isPending
                ? (props.pendingLabel ?? "Eliminando...")
                : (props.confirmLabel ?? "Eliminar")}
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    )
  }
  if (!("title" in props)) return null
  return (
    <Dialog open={open ?? internalOpen} onOpenChange={changeOpen}>
      <Dialog.Trigger render={trigger} />
      <Dialog.Content size="lg" {...props.contentProps}>
        <Dialog.Header title={props.title} description={props.description} />
        <Dialog.Body>{props.children({ close })}</Dialog.Body>
        {[
          <Dialog.Footer key="footer">
            {typeof props.footer === "function"
              ? props.footer({ close })
              : props.footer}
          </Dialog.Footer>,
        ].filter(() => Boolean(props.footer))}
      </Dialog.Content>
    </Dialog>
  )
}
