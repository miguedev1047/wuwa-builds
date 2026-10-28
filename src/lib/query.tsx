import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

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
