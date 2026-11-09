import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Show } from "@/components/utility/show"
import { useState } from "react"

type BuildCardSectionDialogProps = {
  trigger: React.ReactNode
  title: string
  description?: string
  children: (controls: { close: () => void }) => React.ReactNode
}

/** Dialog primitive that edits one section of the build card. */
export function BuildCardSectionDialog({
  trigger,
  title,
  description,
  children,
}: BuildCardSectionDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        nativeButton={false}
        render={<div className="contents">{trigger}</div>}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <Show when={description}>
            <DialogDescription>{description}</DialogDescription>
          </Show>
        </DialogHeader>

        {children({ close: () => setIsOpen(false) })}

        <DialogFooter cols={1}>
          <DialogClose render={<Button size="xl">Cerrar</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
