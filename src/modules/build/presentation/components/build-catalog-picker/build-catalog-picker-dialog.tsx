import { Dialog } from "@/components/panelui/dialog"
import { Show } from "@/components/utility/show"
import { useState } from "react"

type BuildCatalogPickerDialogProps = {
  /** Element that opens the picker dialog. */
  trigger: React.ReactElement
  title: string
  description?: string
  /** Picker rendered inside the fixed-height scroll area. */
  children: (controls: { close: () => void }) => React.ReactNode
}

/**
 * Nested dialog that hosts a catalog picker.
 *
 * The picker lives on a fixed 50vh scroll area so selecting an item never
 * grows the dialog beyond the viewport. The scrollbar stays hidden.
 */
export function BuildCatalogPickerDialog({
  trigger,
  title,
  description,
  children,
}: BuildCatalogPickerDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger render={trigger} />
      <Dialog.Content size="lg">
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Show when={description}>
            <Dialog.Description>{description}</Dialog.Description>
          </Show>
        </Dialog.Header>

        <div
          style={{ height: "50vh" }}
          className="-m-1 no-scrollbar scroll-fade-y overflow-y-auto overscroll-contain p-1"
        >
          {children({ close: () => setIsOpen(false) })}
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
