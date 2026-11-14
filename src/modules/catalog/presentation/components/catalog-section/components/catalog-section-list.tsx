import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Fragment, type ComponentProps, type Key, type ReactNode } from "react"
import { Skeleton } from "@/components/ui/skeleton"
const listVariants = cva("grid grid-cols-1 gap-4 md:grid-cols-2", {
  variants: {
    cols: {
      4: "lg:grid-cols-4",
      6: "lg:grid-cols-6",
      8: "lg:grid-cols-8",
      10: "lg:grid-cols-10",
    },
  },
  defaultVariants: {
    cols: 4,
  },
})

/** Card shape shared by the items and their loading placeholders. */
export const aspectVariants = cva("", {
  variants: {
    aspect: {
      portrait: "aspect-2/3",
      square: "aspect-square",
    },
  },
  defaultVariants: {
    aspect: "portrait",
  },
})

export type CatalogSectionAspect = NonNullable<
  VariantProps<typeof aspectVariants>["aspect"]
>

type CatalogSectionListProps<T> = Omit<ComponentProps<"ul">, "children"> &
  VariantProps<typeof listVariants> &
  VariantProps<typeof aspectVariants> & {
    items: readonly T[]
    /** Render prop for each item; it must return the `<li>` itself. */
    children: (item: T, index: number) => ReactNode
    /** Rendered instead of the list when `items` is empty. */
    empty?: ReactNode
    /** Defaults to the item index, which is only safe for static lists. */
    getItemKey?: (item: T, index: number) => Key
    /** Renders the built-in skeleton grid instead of the list. */
    loading?: boolean
    /** Placeholder cards while loading; defaults to two rows. */
    loadingCount?: number
  }

export function CatalogSectionList<T>({
  className,
  children,
  items,
  empty = null,
  getItemKey,
  cols,
  aspect,
  loading = false,
  loadingCount,
  ...props
}: CatalogSectionListProps<T>) {
  if (loading) {
    return (
      <CatalogSectionLoading cols={cols} aspect={aspect} count={loadingCount} />
    )
  }

  if (items.length === 0) {
    return <>{empty}</>
  }

  return (
    <ul className={cn(listVariants({ cols, className }))} {...props}>
      {items.map((item, index) => (
        <Fragment key={getItemKey?.(item, index) ?? index}>
          {children(item, index)}
        </Fragment>
      ))}
    </ul>
  )
}

type CatalogSectionLoadingProps = VariantProps<typeof listVariants> &
  VariantProps<typeof aspectVariants> & {
    /** Number of placeholder cards; defaults to two rows of `cols`. */
    count?: number
    label?: string
    className?: string
  }

/**
 * Loading state of the section: the same grid and card shape as the real list,
 * filled with skeleton placeholders.
 */
export function CatalogSectionLoading({
  cols,
  aspect,
  count,
  label = "Cargando contenido",
  className,
}: CatalogSectionLoadingProps) {
  const placeholders = count ?? Number(cols ?? 4) * 2

  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <ul aria-hidden className={cn(listVariants({ cols }), className)}>
        {Array.from({ length: placeholders }, (_, index) => (
          <li
            key={index}
            className={cn("overflow-hidden", aspectVariants({ aspect }))}
          >
            <Skeleton className="size-full" />
          </li>
        ))}
      </ul>
    </div>
  )
}
