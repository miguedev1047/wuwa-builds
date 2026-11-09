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
import { cn } from "cn"
import { useState } from "react"

type BuildCardSectionDialogProps = {
  trigger: React.ReactNode
  title: string
  description?: string
  dialogContent?: React.ComponentProps<typeof DialogContent>
  children: (controls: { close: () => void }) => React.ReactNode
}

/**
 * Dialog primitive that edits one section of the build card.
 *
 * Header and footer stay pinned while the section body scrolls inside the
 * viewport, so long editors never push the dialog off screen.
 */
export function BuildCardSectionDialog({
  trigger,
  title,
  description,
  dialogContent,
  children,
}: BuildCardSectionDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="block h-full w-full border-0 bg-transparent p-0 text-left outline-none"
          >
            {trigger}
          </button>
        }
      />
      <DialogContent
        {...dialogContent}
        className={cn(
          "flex max-h-[calc(100dvh-2rem)] flex-col",
          dialogContent?.className
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <Show when={description}>
            <DialogDescription>{description}</DialogDescription>
          </Show>
        </DialogHeader>

        <div className="-mx-1 no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-1">
          {children({ close: () => setIsOpen(false) })}
        </div>

        <DialogFooter cols={1}>
          <DialogClose render={<Button size="xl">Cerrar</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
