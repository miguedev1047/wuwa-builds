import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Show } from "@/components/utility/show"
import { characterQueries } from "@/modules/encore/queries/characters"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/(panel)/admin/resonator/$id")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.query(
      characterQueries.detail(parseInt(params.id))
    )
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
        <Character />
      </Suspense>
    </div>
  )
}

function Character() {
  const { id } = Route.useParams()

  const { data: character } = useSuspenseQuery(
    characterQueries.detail(parseInt(id))
  )

  return (
    <div className="space-y-4">
      <Show when={character.images.iconLarge}>
        {(image) => <img className="aspect-2/3 object-cover" src={image} />}
      </Show>
      <h2 className="text-xl font-bold">{character.name}</h2>

      {/* TODO: Arreglar esto despues */}
      <div dangerouslySetInnerHTML={{ __html: character.introduction }} />
    </div>
  )
}
