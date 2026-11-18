import { NavigationApp } from "@/components/blocks/navigation-app"
import { getSession } from "@/functions/auth"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: async () => ({ session: await getSession() }),
})

function App() {
  const { session } = Route.useRouteContext()

  return (
    <main className="space-y-10">
      <NavigationApp user={session?.user} />
    </main>
  )
}
