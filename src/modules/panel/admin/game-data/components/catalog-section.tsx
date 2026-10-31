import { Button } from "@/components/ui/button"
import { Dock, type DockItemData } from "@/components/ui/dock"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link, type LinkOptions } from "@tanstack/react-router"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Fragment, type ComponentProps, type Key, type ReactNode } from "react"
import { SkeletonBox } from "skullet/react"

/**
 * Presentational shell for the game-data screens: a titled section with an
 * optional action, a responsive grid and a built-in empty state.
 *
 * Every part is a plain element wrapper (`section`, `h2`, `p`, `ul`) so the
 * markup stays semantic and props keep the native element types.
 */

export function CatalogSectionRoot({
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      data-slot="catalog-section"
      className={cn(
        "space-y-4 [--catalog-section-spacing:--spacing(4)]",
        className
      )}
      {...props}
    />
  )
}

export function CatalogSectionHeader({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="catalog-section-header"
      className={cn(
        "group/catalog-section-header @container/catalog-section-header grid auto-rows-min items-start gap-1 has-data-[slot=catalog-section-action]:grid-cols-[1fr_auto] has-data-[slot=catalog-section-description]:grid-rows-[auto_auto] [.border-b]:pb-(--catalog-section-spacing)",
        className
      )}
      {...props}
    />
  )
}

export function CatalogSectionTitle({
  className,
  ...props
}: ComponentProps<"h2">) {
  return (
    <h2
      data-slot="catalog-section-title"
      className={cn("font-heading text-xl font-bold", className)}
      {...props}
    />
  )
}

export function CatalogSectionDescription({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      data-slot="catalog-section-description"
      className={cn("text-xs/relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

export function CatalogSectionAction({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="catalog-section-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 flex items-center gap-2 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

export function CatalogSectionContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="catalog-section-content"
      className={cn("space-y-4", className)}
      {...props}
    />
  )
}
const listVariants = cva("grid grid-cols-1 gap-4 md:grid-cols-2", {
  variants: {
    cols: {
      4: "lg:grid-cols-4",
      6: "lg:grid-cols-6",
      10: "lg:grid-cols-10",
    },
  },
  defaultVariants: {
    cols: 4,
  },
})

/** Card shape shared by the items and their loading placeholders. */
const aspectVariants = cva("", {
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
 * filled with `SkeletonBox` bars.
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
            <SkeletonBox width="100%" height="100%" />
          </li>
        ))}
      </ul>
    </div>
  )
}

type CatalogSectionItemProps = React.ComponentProps<"li"> &
  VariantProps<typeof aspectVariants>

export function CatalogSectionItem({
  className,
  aspect,
  ...props
}: CatalogSectionItemProps) {
  return (
    <li
      data-slot="catalog-section-item"
      role="button"
      className={cn(
        "overflow-hidden bg-accent",
        aspectVariants({ aspect }),
        className
      )}
      {...props}
    />
  )
}

interface CatalogSectionImage extends React.ComponentProps<"img"> {
  animated?: boolean
}

export function CatalogSectionImage({
  className,
  animated,
  ...props
}: CatalogSectionImage) {
  return (
    <img
      data-slot="catalog-section-image"
      className={cn(
        "size-full! object-cover transition-transform ease-in-out",
        animated && "hover:scale-120",
        className
      )}
      {...props}
    />
  )
}

type CatalogSectionEmptyProps = {
  title: ReactNode
  description: ReactNode
  action?: {
    label: string
    linkOptions: LinkOptions
  }
}

export function CatalogSectionEmpty({
  title,
  description,
  action,
}: CatalogSectionEmptyProps) {
  return (
    <Empty className="h-100 border border-dashed">
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action ? (
        <EmptyContent>
          <Button
            nativeButton={false}
            render={
              <Link {...action.linkOptions}>
                <HugeiconsIcon icon={PlusIcon} />
                {action.label}
              </Link>
            }
          />
        </EmptyContent>
      ) : null}
    </Empty>
  )
}

interface CatalogSectionDockProps {
  items: DockItemData[]
}

/**
 * Floating action bar for the catalog screens: it is the main action surface,
 * so pages no longer render header buttons. `CatalogSection.Action` stays
 * available for screens that need inline actions (detail pages, forms).
 *
 * The bar is fixed to the viewport bottom, respects the iOS safe area and
 * reserves its own height so the grid never ends underneath it.
 */
export function CatalogSectionDockActions({ items }: CatalogSectionDockProps) {
  return (
    <>
      <nav
        aria-label="Acciones del catalogo"
        className="fixed inset-x-0 bottom-0 z-40 h-0"
      >
        <Dock
          items={items}
          className="bottom-[max(12px,env(safe-area-inset-bottom))]!"
          baseItemSize={44}
          magnification={58}
          panelHeight={60}
          gap={8}
          bounce={false}
          showLabels
          showIndicators
          showBadges={false}
        />
      </nav>

      <div aria-hidden className="h-24" />
    </>
  )
}

export const CatalogSection = {
  Root: CatalogSectionRoot,
  Header: CatalogSectionHeader,
  Title: CatalogSectionTitle,
  Description: CatalogSectionDescription,
  Action: CatalogSectionAction,
  List: CatalogSectionList,
  Content: CatalogSectionContent,
  Item: CatalogSectionItem,
  Image: CatalogSectionImage,
  Empty: CatalogSectionEmpty,
  Loading: CatalogSectionLoading,
  DockActions: CatalogSectionDockActions,
} as const
