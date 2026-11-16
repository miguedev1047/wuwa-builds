import { Button } from "@/components/panelui/button"
import { Dialog } from "@/components/panelui/dialog"
import { Show } from "@/components/utility/show"
import { BuildCardTrigger } from "@build/presentation/components/build-card-section/build-card-trigger"
import { cn } from "cn"
import { useState } from "react"

type BuildCardSectionDialogProps = {
  trigger: React.ReactNode
  title: string
  description?: string
  dialogContent?: React.ComponentProps<typeof Dialog.Content>
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
      <Dialog.Trigger render={<BuildCardTrigger>{trigger}</BuildCardTrigger>} />
      <Dialog.Content
        {...dialogContent}
        className={cn(
          "flex max-h-[calc(100dvh-2rem)] flex-col",
          dialogContent?.className
        )}
      >
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Show when={description}>
            <Dialog.Description>{description}</Dialog.Description>
          </Show>
        </Dialog.Header>

        <div className="-mx-1 no-scrollbar min-h-0 flex-1 scroll-fade-y overflow-y-auto overscroll-contain px-1">
          {children({ close: () => setIsOpen(false) })}
        </div>

        <Dialog.Footer>
          <Dialog.Close render={<Button size="lg">Cerrar</Button>} />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
