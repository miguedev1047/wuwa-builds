import {
  RouteNavigationActions,
  RouteNavigationContent,
  RouteNavigationDescription,
  RouteNavigationHeader,
  RouteNavigationRoot,
  RouteNavigationTitle,
} from "@/components/blocks/route-navigation/route-navigation"
import {
  RouteNavigationList,
  RouteNavigationListLoading,
} from "@/components/blocks/route-navigation/components/route-navigation-list"
export { routeNavigationAspectVariants } from "@/components/blocks/route-navigation/components/route-navigation-list"
export type { RouteNavigationVariant } from "@/components/blocks/route-navigation/components/route-navigation-variant"
export type { RouteNavigationHeading } from "@/components/blocks/route-navigation/route-navigation"
export type { RouteNavigationAspect } from "@/components/blocks/route-navigation/components/route-navigation-list"

/** Page shell of a route screen: header, body and the grid list. */
export const RouteNavigation = {
  Root: RouteNavigationRoot,
  Header: RouteNavigationHeader,
  Title: RouteNavigationTitle,
  Description: RouteNavigationDescription,
  Actions: RouteNavigationActions,
  Content: RouteNavigationContent,
  List: RouteNavigationList,
  Loading: RouteNavigationListLoading,
} as const
