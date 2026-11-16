import appCss from "@/styles/index.css?url"

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
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <NuqsAdapter>
          <ThemeProvider defaultTheme="system" storageKey="theme">
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
