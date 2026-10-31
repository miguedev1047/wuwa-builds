import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react"
import { SkeletonBox } from "skullet/react"

/**
 * Command palette used to pick external (Encore) data and prefill admin forms.
 *
 * It is a thin layer over cmdk's `Command`: filtering, keyboard navigation and
 * the empty state come from the library, and the only extra behaviour is
 * closing the dialog once an item is selected.
 *
 * ```tsx
 * <CatalogSearch.Root trigger={<Button>Buscar</Button>} title="Buscar">
 *   <CatalogSearch.Input placeholder="Nombre o ID" />
 *   <CatalogSearch.List>
 *     <CatalogSearch.Empty>Sin resultados</CatalogSearch.Empty>
 *     {items.map((item) => (
 *       <CatalogSearch.Item key={item.id} value={`${item.name} ${item.id}`} onSelect={() => pick(item)}>
 *         {item.name}
 *       </CatalogSearch.Item>
 *     ))}
 *   </CatalogSearch.List>
 * </CatalogSearch.Root>
 * ```
 */

type CatalogSearchContextValue = {
  close: () => void
}

const CatalogSearchContext = createContext<CatalogSearchContextValue | null>(
  null
)

function useCatalogSearch() {
  const context = useContext(CatalogSearchContext)

  if (!context) {
    throw new Error(
      "CatalogSearch.Item must be rendered inside CatalogSearch.Root"
    )
  }

  return context
}

type CatalogSearchRootProps = {
  /** Element the dialog trigger merges into (usually a `Button`). */
  trigger: ReactElement
  title?: string
  description?: string
  className?: string
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CatalogSearchRoot({
  trigger,
  title = "Buscar",
  description = "Busca y selecciona un elemento para rellenar el formulario.",
  className,
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: CatalogSearchRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const open = controlledOpen ?? uncontrolledOpen

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [controlledOpen, onOpenChange]
  )

  const close = useCallback(() => setOpen(false), [setOpen])

  return (
    <CatalogSearchContext.Provider value={{ close }}>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        trigger={trigger}
        title={title}
        description={description}
        className={className}
      >
        {children}
      </CommandDialog>
    </CatalogSearchContext.Provider>
  )
}

type CatalogSearchItemProps = ComponentProps<typeof CommandItem>

/** Selects an item and closes the palette. */
export function CatalogSearchItem({
  onSelect,
  ...props
}: CatalogSearchItemProps) {
  const { close } = useCatalogSearch()

  return (
    <CommandItem
      {...props}
      onSelect={(value) => {
        onSelect?.(value)
        close()
      }}
    />
  )
}

type CatalogSearchLoadingProps = {
  count?: number
}

/** Placeholder rows for the `Suspense` fallback. */
export function CatalogSearchLoading({ count = 6 }: CatalogSearchLoadingProps) {
  return (
    <div aria-hidden className="space-y-1 p-1">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex min-h-7 items-center gap-2 rounded-md px-2.5 py-1.5"
        >
          <SkeletonBox width={28} height={28} radius="0.125rem" />
          <SkeletonBox width="45%" height={12} />
        </div>
      ))}
    </div>
  )
}

export const CatalogSearch = {
  Root: CatalogSearchRoot,
  Input: CommandInput,
  List: CommandList,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Item: CatalogSearchItem,
  Separator: CommandSeparator,
  Shortcut: CommandShortcut,
  Loading: CatalogSearchLoading,
} as const
