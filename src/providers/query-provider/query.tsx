import { DbClient } from "@tanstack/react-db"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createIsomorphicFn } from "@tanstack/react-start"

export function getDb() {
  const getRuntime = createIsomorphicFn()
    .server(() => `server` as const)
    .client(() => `browser` as const)

  const dbClient = new DbClient({
    runtime: getRuntime(),
  })

  return { dbClient }
}

export function getQuery() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: "static",
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
      },
    },
  })
  return { queryClient }
}

export function QueryProvider({
  children,
  client,
}: {
  children: React.ReactNode
  client: QueryClient
}) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
