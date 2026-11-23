import { createContext, useContext } from "react"

/**
 * Width preset of a route region. `compact` uses the standard centered column,
 * `wide` uses a wider centered column, `extended` spans the viewport with an
 * inset header, and `inline` is for sections already inside a container.
 */
export type RouteNavigationVariant = "compact" | "wide" | "extended" | "inline"

/** Variant declared by the closest `RouteNavigation.Root`. */
export const RouteNavigationVariantContext =
  createContext<RouteNavigationVariant>("compact")

/** Reads the variant declared by the closest `RouteNavigation.Root`. */
export function useRouteNavigationVariant() {
  return useContext(RouteNavigationVariantContext)
}

const HEADER_CONTAINER = {
  wide: "mx-auto w-full max-w-[1408px] px-4 md:px-8",
  compact: "mx-auto w-full max-w-5xl px-4 md:px-8",
  extended: "w-full px-4 md:px-8",
  inline: "w-full",
} as const

const CONTENT_CONTAINER = {
  wide: "mx-auto w-full max-w-[1408px] px-4 md:px-8",
  compact: "mx-auto w-full max-w-5xl px-4 md:px-8",
  extended: "w-full",
  inline: "w-full",
} as const

/** Horizontal container of the page header for the given variant. */
export function routeNavigationHeaderContainer(
  variant: RouteNavigationVariant
) {
  return HEADER_CONTAINER[variant]
}

/** Horizontal container of the page body for the given variant. */
export function routeNavigationContentContainer(
  variant: RouteNavigationVariant
) {
  return CONTENT_CONTAINER[variant]
}
