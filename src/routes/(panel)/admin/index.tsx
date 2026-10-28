import { Spinner } from "@/components/ui/spinner"
import { Show } from "@/components/utility/show"
import { characterQueries } from "@/modules/encore/queries/characters"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/(panel)/admin/")({
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

function CharacterList() {
  const { data: characters } = useSuspenseQuery(characterQueries.list())

  return (
    <ul className="grid grid-cols-5 gap-4">
      {characters.map((character) => (
        <Link
          key={character.id}
          to="/admin/resonator/$id"
          params={{ id: String(character.id) }}
        >
          <li>
            <Show when={character.icon}>
              {(icon) => (
                <img className="aspect-2/3 size-full object-cover" src={icon} />
              )}
            </Show>
          </li>
        </Link>
      ))}
    </ul>
  )
}
