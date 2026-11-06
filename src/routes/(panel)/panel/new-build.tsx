import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { CharacterList } from "@/modules/panel/user/new-build/components/character-list"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/(panel)/panel/new-build")({
  component: RouteComponent,
  pendingComponent: () => <Spinner />,
  ssr: false,
  loader: async ({ context }) => {
    await context.queryClient.query(characterQueries.list())
  },
})

function RouteComponent() {
  return <NewBuildContent />
}

function NewBuildContent() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 py-20">
      <Button
        nativeButton={false}
        variant="link"
        render={<Link to="/panel/my-builds">Volver</Link>}
      />

      <div className="space-y-4">
        <section className="space-y-3">
          <h2 className="text-lg font-medium">Resonator Selector</h2>
          <Suspense fallback={<Spinner />}>
            <CharacterList />
          </Suspense>
        </section>
      </div>
    </div>
  )
}
