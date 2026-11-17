"use client"

import { Command } from "@/components/panelui/command"
import { Popover } from "@/components/ui/popover"
import type { ReactElement, ReactNode } from "react"

/** Generic command surface; each consumer controls its own dialog lifecycle. */
export type CommandSearchRootProps = {
  trigger: ReactElement
  search?: string
  onSearchChange?: (search: string) => void
  filter?: boolean
  title?: string
  description?: string
  className?: string
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/** Renders a dialog without imposing selection, reset or persistence behavior. */
export function CommandSearchRoot({
  trigger,
  search,
  onSearchChange,
  filter = true,
  title = "Buscar",
  description = "Busca y selecciona un elemento.",
  className,
  children,
  open,
  defaultOpen,
  onOpenChange,
}: CommandSearchRootProps) {
  return (
    <Popover>
      <Command.Dialog
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        trigger={trigger}
        label={title}
        hotkey={null}
        className={className}
      >
        <Command
          aria-label={title}
          search={search}
          onSearchChange={onSearchChange}
          filter={filter}
        >
          <p className="sr-only">{description}</p>
          {children}
        </Command>
      </Command.Dialog>
    </Popover>
  )
}
