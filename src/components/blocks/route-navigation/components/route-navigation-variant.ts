import { createContext, useContext } from "react"

/**
 * Width preset of a route region: `compact` keeps the `max-w-5xl` column,
 * `extended` spans the viewport with an inset header, and `inline` adds no
 * container, for nested sections already inside a page.
 */
export type RouteNavigationVariant = "compact" | "extended" | "inline"

/** Variant declared by the closest `RouteNavigation.Root`. */
export const RouteNavigationVariantContext =
  createContext<RouteNavigationVariant>("compact")

/** Reads the variant declared by the closest `RouteNavigation.Root`. */
export function useRouteNavigationVariant() {
  return useContext(RouteNavigationVariantContext)
}

const HEADER_CONTAINER = {
  compact: "mx-auto w-full max-w-5xl px-4 md:px-8",
  extended: "w-full px-4 md:px-8",
  inline: "w-full",
} as const

const CONTENT_CONTAINER = {
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
