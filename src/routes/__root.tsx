import appCss from "@/styles/index.css?url"
import { RouteNotFound } from "@/routing/home/route-state"

import { NuqsAdapter } from "nuqs/adapters/tanstack-router"
import { Toast } from "@/components/panelui/toast"
import { Tooltip } from "@/components/panelui/tooltip"
import { Devtools } from "@/components/utility/devtools"
import { ThemeProvider } from "@/providers/theme-provider"
import type { DbClient } from "@tanstack/react-db"
import type { QueryClient } from "@tanstack/react-query"
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"

export interface RouteContext {
  dbClient: DbClient
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouteContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Wuwa Builds",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/png",
        href: "/landing/mark.png",
      },
    ],
  }),
  notFoundComponent: RouteNotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <NuqsAdapter>
          <ThemeProvider defaultTheme="dark" storageKey="theme">
            <Toast.Provider>
              <Tooltip.Provider>{children}</Tooltip.Provider>
            </Toast.Provider>
          </ThemeProvider>
        </NuqsAdapter>
        <Devtools />
        <Scripts />
      </body>
    </html>
  )
}
