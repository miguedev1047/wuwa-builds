import { cn } from "cn"
import {
  buildCatalogPickerVariants,
  type BuildCatalogPickerColumns,
} from "@builder/ui/build-catalog-picker/build-catalog-picker-variants"

type BuildCatalogPickerProps<T> = {
  items: readonly T[]
  getItemKey: (item: T) => React.Key
  children: (item: T) => React.ReactNode
  emptyMessage?: string
  columns?: BuildCatalogPickerColumns
  className?: string
}

/** Grid shell shared by the resonator, weapon and echo pickers. */
export function BuildCatalogPicker<T>({
  items,
  getItemKey,
  children,
  emptyMessage = "No hay elementos disponibles.",
  columns,
  className,
}: BuildCatalogPickerProps<T>) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <ul className={cn(buildCatalogPickerVariants({ columns }), className)}>
      {items.map((item) => (
        <li key={getItemKey(item)} className="min-w-0">
          {children(item)}
        </li>
      ))}
    </ul>
  )
}
