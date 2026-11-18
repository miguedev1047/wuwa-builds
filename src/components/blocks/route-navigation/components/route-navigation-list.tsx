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
export const routeNavigationAspectVariants = cva("", {
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

export type RouteNavigationAspect = NonNullable<
  VariantProps<typeof routeNavigationAspectVariants>["aspect"]
>

type RouteNavigationListProps<T> = Omit<ComponentProps<"ul">, "children"> &
  VariantProps<typeof listVariants> &
  VariantProps<typeof routeNavigationAspectVariants> & {
    items: readonly T[]
    /** Stable identity of each entry; pass the entity id, never the index. */
    getKey: (item: T, index: number) => Key
    /** Render prop for each item; it must return the `<li>` itself. */
    children: (item: T, index: number) => ReactNode
    /** Rendered instead of the list when `items` is empty. */
    empty?: ReactNode
    /** Renders the built-in skeleton grid instead of the list. */
    loading?: boolean
    /** Placeholder cards while loading; defaults to two rows. */
    loadingCount?: number
    /** Read out by assistive tech while the grid is loading. */
    loadingLabel?: string
  }

/**
 * Responsive grid of entries. It never reads data: the component that
 * suspends loads the items and passes them here.
 */
export function RouteNavigationList<T>({
  className,
  children,
  items,
  getKey,
  empty = null,
  cols,
  aspect,
  loading = false,
  loadingCount,
  loadingLabel,
  ...props
}: RouteNavigationListProps<T>) {
  if (loading) {
    return (
      <RouteNavigationListLoading
        cols={cols}
        aspect={aspect}
        count={loadingCount}
        label={loadingLabel}
      />
    )
  }

  if (items.length === 0) {
    return <>{empty}</>
  }

  return (
    <ul className={cn(listVariants({ cols, className }))} {...props}>
      {items.map((item, index) => (
        <Fragment key={getKey(item, index)}>{children(item, index)}</Fragment>
      ))}
    </ul>
  )
}

type RouteNavigationListLoadingProps = VariantProps<typeof listVariants> &
  VariantProps<typeof routeNavigationAspectVariants> & {
    /** Number of placeholder cards; defaults to two rows of `cols`. */
    count?: number
    /** Read out by assistive tech while the grid is loading. */
    label?: string
    className?: string
  }

/** Skeleton grid with the same columns and card shape as the real list. */
export function RouteNavigationListLoading({
  cols,
  aspect,
  count,
  label = "Cargando contenido",
  className,
}: RouteNavigationListLoadingProps) {
  const placeholders = count ?? Number(cols ?? 4) * 2

  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <ul aria-hidden className={cn(listVariants({ cols }), className)}>
        {Array.from({ length: placeholders }, (_, index) => (
          <li
            key={index}
            className={cn(
              "overflow-hidden",
              routeNavigationAspectVariants({ aspect })
            )}
          >
            <Skeleton className="size-full" />
          </li>
        ))}
      </ul>
    </div>
  )
}
