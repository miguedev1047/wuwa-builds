import { Button } from "@/components/panelui/button"
import { Command } from "@/components/panelui/command"
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { useCommandSearch } from "@/components/blocks/command-search/command-search-context"
import { cn } from "cn"
import type { ComponentProps, ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { XIcon } from "@hugeicons/core-free-icons"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"

type CommandSearchItemProps = ComponentProps<typeof Command.Item>

/** Selects a result and closes the search dialog. */
export function CommandSearchItem({
  onSelect,
  ...props
}: CommandSearchItemProps) {
  const { close } = useCommandSearch()

  return (
    <Command.Item
      {...props}
      onSelect={() => {
        onSelect?.()
        close()
      }}
    />
  )
}

type CommandSearchFilterTriggerProps = {
  children?: ReactNode
  className?: string
}

/** Opens the filter popover from the Command input row. */
export function CommandSearchFilterTrigger({
  children = "Filtros",
  className,
}: CommandSearchFilterTriggerProps) {
  return (
    <PopoverTrigger
      render={
        <Button type="button" variant="ghost" size="sm" className={className}>
          {children}
        </Button>
      }
    />
  )
}

type CommandSearchFilterContentProps = {
  children: ReactNode
  hasActiveFilter?: boolean
  onClearFilters?: () => void
  className?: string
}

/** Filter surface sized for stacked controls. */
export function CommandSearchFilterContent({
  children,
  hasActiveFilter = false,
  onClearFilters,
  className,
}: CommandSearchFilterContentProps) {
  return (
    <PopoverContent
      align="end"
      className={cn("grid w-80 grid-cols-1 gap-2", className)}
    >
      {children}
      <Show when={hasActiveFilter}>
        <Separator />
        <Button variant="destructive" onClick={onClearFilters}>
          <HugeiconsIcon icon={XIcon} />
          Limpiar filtros
        </Button>
      </Show>
    </PopoverContent>
  )
}

type CommandSearchLoadingProps = {
  count?: number
}

/** Placeholder rows for a Suspense fallback. */
export function CommandSearchLoading({ count = 6 }: CommandSearchLoadingProps) {
  return (
    <div aria-hidden className="space-y-1 p-1">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex min-h-7 items-center gap-2 rounded-md px-2.5 py-1.5"
        >
          <Skeleton className="size-7 rounded-lg" />
          <Skeleton className="h-3 w-9/20" />
        </div>
      ))}
    </div>
  )
}
