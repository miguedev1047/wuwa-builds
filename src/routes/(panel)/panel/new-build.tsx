import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ResonatorLists } from "@/modules/panel/user/new-build/components/resonator-list"
import { characterQueries } from "@/modules/encore/queries/characters"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/(panel)/panel/new-build")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.query(characterQueries.list())
  },
})

function RouteComponent() {
  return (
    <div className="space-y-4">
      <Button
        render={<Link to="/panel/my-builds">Back</Link>}
        nativeButton={false}
        variant="link"
      />

      <Suspense fallback={<Spinner />}>
        <ResonatorLists />
      </Suspense>
    </div>
  )
}
