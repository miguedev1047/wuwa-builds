import { cn } from "cn"
import type { ComponentProps } from "react"
import {
  RouteNavigationVariantContext,
  routeNavigationContentContainer,
  routeNavigationHeaderContainer,
  useRouteNavigationVariant,
  type RouteNavigationVariant,
} from "@/components/blocks/route-navigation/components/route-navigation-variant"

type VariantProps = {
  /** Overrides the variant declared by `Root` for this part only. */
  variant?: RouteNavigationVariant
}

/**
 * Page wrapper of a route screen: the vertical rhythm and the variant its
 * header and content inherit. It renders a `<section>` so the page stays
 * semantic, and the constraint lives in the parts, not here.
 */
export function RouteNavigationRoot({
  variant = "compact",
  className,
  children,
  ...props
}: ComponentProps<"section"> & VariantProps) {
  return (
    <RouteNavigationVariantContext value={variant}>
      <section
        data-slot="route-navigation"
        data-variant={variant}
        className={cn("space-y-6 py-8", className)}
        {...props}
      >
        {children}
      </section>
    </RouteNavigationVariantContext>
  )
}

/** Title, description and actions of the page, aligned in one block. */
export function RouteNavigationHeader({
  variant: variantProp,
  className,
  ...props
}: ComponentProps<"div"> & VariantProps) {
  const inheritedVariant = useRouteNavigationVariant()
  const variant = variantProp ?? inheritedVariant

  return (
    <div
      data-slot="route-navigation-header"
      className={cn(
        "grid auto-rows-min items-start gap-1 has-data-[slot=route-navigation-actions]:grid-cols-[1fr_auto] has-data-[slot=route-navigation-description]:grid-rows-[auto_auto]",
        routeNavigationHeaderContainer(variant),
        className
      )}
      {...props}
    />
  )
}

/** Page headline. Screens with a visible title render it once, as the `h1`. */
export function RouteNavigationTitle({
  className,
  ...props
}: ComponentProps<"h1">) {
  return (
    <h1
      data-slot="route-navigation-title"
      className={cn("font-heading text-2xl font-bold", className)}
      {...props}
    />
  )
}

/** One line under the title that explains the screen. */
export function RouteNavigationDescription({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      data-slot="route-navigation-description"
      className={cn("text-sm/relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

/** Buttons at the end of the header row. */
export function RouteNavigationActions({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="route-navigation-actions"
      className={cn(
        "col-start-2 row-span-2 row-start-1 flex items-center gap-2 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/** Body of the page. */
export function RouteNavigationContent({
  variant: variantProp,
  className,
  ...props
}: ComponentProps<"div"> & VariantProps) {
  const inheritedVariant = useRouteNavigationVariant()
  const variant = variantProp ?? inheritedVariant

  return (
    <div
      data-slot="route-navigation-content"
      className={cn(
        "space-y-6",
        routeNavigationContentContainer(variant),
        className
      )}
      {...props}
    />
  )
}
