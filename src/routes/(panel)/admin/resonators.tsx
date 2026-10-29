import { Spinner } from "@/components/ui/spinner"
import { characterQueries } from "@/modules/encore/queries/characters"
import { CharacterList } from "@/modules/panel/admin/components/character-list"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/(panel)/admin/resonators")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.query(characterQueries.list())
  },
})

function RouteComponent() {
  return (
    <div className="mx-auto max-w-5xl py-20">
      <Suspense fallback={<Spinner />}>
        <CharacterList />
      </Suspense>
    </div>
  )
}
