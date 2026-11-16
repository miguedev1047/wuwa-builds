"use client"

import { Command } from "@/components/panelui/command"
import { Popover } from "@/components/ui/popover"
import { CommandSearchContext } from "@/components/blocks/command-search/command-search-context"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react"

/** Shared Command dialog with optional URL synchronized search and filters. */
export type CommandSearchRootProps = {
  /** Element the dialog trigger merges into (usually a button). */
  trigger: ReactElement
  /** Clears this search's URL state after the dialog closes. */
  clearSearchParams: () => void
  /** Controlled search text, commonly backed by nuqs. */
  search?: string
  /** Receives search text changes. */
  onSearchChange?: (search: string) => void
  title?: string
  description?: string
  className?: string
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/** Renders a reusable Command dialog and clears its URL state on close. */
export function CommandSearchRoot({
  trigger,
  clearSearchParams,
  search,
  title = "Buscar",
  description = "Busca y selecciona un elemento.",
  className,
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: CommandSearchRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const open = controlledOpen ?? uncontrolledOpen
  const wasOpen = useRef(open)

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [controlledOpen, onOpenChange]
  )

  const close = useCallback(() => setOpen(false), [setOpen])

  useEffect(() => {
    if (wasOpen.current && !open) clearSearchParams()
    wasOpen.current = open
  }, [clearSearchParams, open])

  return (
    <Popover>
      <CommandSearchContext.Provider value={{ close }}>
        <Command.Dialog
          open={open}
          onOpenChange={setOpen}
          trigger={trigger}
          label={title}
          hotkey={null}
          className={className}
        >
          <Command
            aria-label={title}
            search={search}
            // onSearchChange={onSearchChange}
          >
            <p className="sr-only">{description}</p>
            {children}
          </Command>
        </Command.Dialog>
      </CommandSearchContext.Provider>
    </Popover>
  )
}
