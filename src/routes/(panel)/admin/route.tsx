import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Show } from "@/components/utility/show"
import { getSession } from "@/functions/auth"
import { SecurityIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession()

    if (!session) {
      throw redirect({ to: "/auth/login" })
    }

    return { session }
  },
})

function RouteComponent() {
  const { session } = Route.useRouteContext()

  return (
    <Show when={session?.user.role}>
      {(role) => (
        <Show
          when={role === "ADMIN"}
          fallback={
            <div className="flex h-screen w-full items-center justify-center">
              <Empty>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={SecurityIcon} />
                </EmptyMedia>
                <EmptyTitle>Acceso bloqueado</EmptyTitle>
                <EmptyDescription>
                  El contenido de esta pagina esta bloqueado
                </EmptyDescription>
                <EmptyContent>
                  <Button
                    nativeButton={false}
                    render={<Link to="/panel">Volver al inicio</Link>}
                  />
                </EmptyContent>
              </Empty>
            </div>
          }
        >
          <main className="mx-auto max-w-5xl px-4 py-20 md:px-8">
            <Outlet />
          </main>
        </Show>
      )}
    </Show>
  )
}
