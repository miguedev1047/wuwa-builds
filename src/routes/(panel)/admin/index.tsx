import { Spinner } from "@/components/ui/spinner"
import { Show } from "@/components/utility/show"
import { getResonatorsQueryOpts } from "@/modules/panel/admin/queries/get-resonators"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/(panel)/admin/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.query(getResonatorsQueryOpts)
  },
})

function RouteComponent() {
  return (
    <div className="mx-auto max-w-5xl py-20">
      <Suspense fallback={<Spinner />}>
        <ResonatorLists />
      </Suspense>
    </div>
  )
}

function ResonatorLists() {
  const { data: resonators } = useSuspenseQuery(getResonatorsQueryOpts)

  return (
    <ul className="grid grid-cols-5 gap-4">
      <Show when={resonators?.characters}>
        {(characters) =>
          characters.map((resonator) => (
            <Link
              key={resonator.name}
              to="/admin/resonator/$slug"
              params={{ slug: resonator.slug }}
            >
              <li>
                <Show when={resonator.cardImage}>
                  {(image) => (
                    <img
                      className="aspect-2/3 size-full object-cover"
                      src={image}
                    />
                  )}
                </Show>
              </li>
            </Link>
          ))
        }
      </Show>
    </ul>
  )
}
