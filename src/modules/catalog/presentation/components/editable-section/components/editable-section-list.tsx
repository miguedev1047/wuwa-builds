import { Item, ItemGroup } from "@/components/ui/item"
import { cn } from "cn"
import { Fragment, type ComponentProps, type Key, type ReactNode } from "react"

type EditableSectionListProps<T> = {
  items: readonly T[]
  /** Render prop for each row; it must return an `Item`. */
  children: (item: T, index: number) => ReactNode
  /** Rendered instead of the list when `items` is empty. */
  empty?: ReactNode
  /** Defaults to the item index, which is only safe for static lists. */
  getItemKey?: (item: T, index: number) => Key
  className?: string
}

export function EditableSectionList<T>({
  items,
  children,
  empty = null,
  className,
  getItemKey,
}: EditableSectionListProps<T>) {
  if (items.length === 0) {
    return <>{empty}</>
  }

  return (
    <ItemGroup className={cn(className)} data-slot="editable-section-list">
      {items.map((item, index) => (
        <Fragment key={getItemKey?.(item, index) ?? index}>
          {children(item, index)}
        </Fragment>
      ))}
    </ItemGroup>
  )
}

export function EditableSectionItem({
  className,
  ...props
}: ComponentProps<typeof Item>) {
  return (
    <Item
      data-slot="editable-section-item"
      variant="muted"
      className={className}
      {...props}
    />
  )
}
