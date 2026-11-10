import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
      <DialogTrigger
        render={<div className="outline-0 outline-none">{trigger}</div>}
      />
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <Show when={description}>
            <DialogDescription>{description}</DialogDescription>
          </Show>
        </DialogHeader>

        <div
          style={{ height: "50vh" }}
          className="-m-1 no-scrollbar scroll-fade-y overflow-y-auto overscroll-contain p-1"
        >
          {children({ close: () => setIsOpen(false) })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
