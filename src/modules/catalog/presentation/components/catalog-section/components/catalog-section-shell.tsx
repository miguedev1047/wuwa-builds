import { cn } from "cn"
import type { ComponentProps } from "react"
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
