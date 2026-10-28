import { routeTree } from "./routeTree.gen"

import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { getQuery, QueryProvider } from "@/providers/query-provider"

export function getRouter() {
  const { queryClient } = getQuery()

  const router = createTanStackRouter({
    routeTree,

    context: { queryClient },

    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,

    Wrap: ({ children }) => (
      <QueryProvider client={queryClient}>{children}</QueryProvider>
    ),
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
