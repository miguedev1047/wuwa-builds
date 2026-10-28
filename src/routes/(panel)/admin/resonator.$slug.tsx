import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Show } from "@/components/utility/show"
import { getResonatorQueryOpts } from "@/modules/panel/admin/queries/get-resonators"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/(panel)/admin/resonator/$slug")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const slug = params.slug
    await context.queryClient.query(getResonatorQueryOpts(slug))
  },
})

function RouteComponent() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 py-20">
      <Button
        render={<Link to="/admin">Back</Link>}
        nativeButton={false}
        variant="link"
      />

      <Suspense fallback={<Spinner />}>
        <Resonator />
      </Suspense>
    </div>
  )
}

function Resonator() {
  const { slug } = Route.useParams()
  const { data: resonator } = useSuspenseQuery(getResonatorQueryOpts(slug))

  return (
    <div>
      <Show when={resonator}>
        {(resonator) => (
          <Show when={resonator.images.card}>
            {(image) => (
              <div>
                <img className="aspect-2/3 object-cover" src={image} />
                <h2>{resonator.name}</h2>
              </div>
            )}
          </Show>
        )}
      </Show>
    </div>
  )
}
