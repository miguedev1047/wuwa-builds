import type { AlertDialog } from "@/components/panelui/alert-dialog"
import type { Button } from "@/components/panelui/button"
import type { Dialog } from "@/components/panelui/dialog"
import type { ComponentProps, ReactElement, ReactNode } from "react"

/** Controls shared by the dialog body and footer. */
export type ActionControls = { close: () => void }

/** Presentation shared by direct, form and confirmation actions. */
type ActionBase = {
  label?: string
  icon?: ReactNode
  trigger?: ReactElement
  size?: ComponentProps<typeof Button>["size"]
  buttonProps?: Omit<ComponentProps<typeof Button>, "children" | "onClick">
  disabled?: boolean
  isPending?: boolean
  className?: string
  "aria-label"?: string
  "aria-busy"?: boolean
  type?: "button" | "submit" | "reset"
}

type ActionOverlay = {
  title: string
  description?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/** A button that invokes a handler without opening an overlay. */
export type DirectActionProps = ActionBase & {
  mode?: "default" | "edit" | "destructive"
  onClick: ComponentProps<typeof Button>["onClick"]
  onConfirm?: never
  children?: ReactNode
}

/** An editable form, with its footer outside the scrolling body. */
export type FormActionProps = ActionBase &
  ActionOverlay & {
    mode?: "default" | "edit"
    onClick?: never
    onConfirm?: never
    children: (controls: ActionControls) => ReactNode
    footer?: ReactNode | ((controls: ActionControls) => ReactNode)
    contentProps?: ComponentProps<typeof Dialog.Content>
  }

/** A confirmation that waits for the mutation before closing. */
export type ConfirmActionProps = ActionBase &
  ActionOverlay & {
    mode: "destructive"
    onClick?: never
    children?: never
    onConfirm: () => void | Promise<unknown>
    confirmLabel?: string
    cancelLabel?: string
    pendingLabel?: string
    contentProps?: ComponentProps<typeof AlertDialog.Content>
  }

export type EditableSectionActionProps =
  DirectActionProps | FormActionProps | ConfirmActionProps
