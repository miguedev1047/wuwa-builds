import { createContext, useContext } from "react"

/** Content width preset of a route page. */
export type RouteNavigationVariant = "compact" | "extended"

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
} as const

const CONTENT_CONTAINER = {
  compact: "mx-auto w-full max-w-5xl px-4 md:px-8",
  extended: "w-full",
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
