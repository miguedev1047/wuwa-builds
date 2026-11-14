import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { buildCollection } from "@build/client/build-store"
import { useRosterBuilds } from "@build/client/hooks/build-live-queries"
import { Link, useParams } from "@tanstack/react-router"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/panel/builder/r/$rosterId/")({
  component: RouteComponent,
  pendingComponent: () => <Spinner />,
  loader: async () => {
    await buildCollection.preload()
  },
  ssr: false,
})

function RouteComponent() {
  const params = useParams({ from: "/(panel)/panel/builder/r/$rosterId/" })
  const rosterId = parseInt(params.rosterId)

  const { data: builds } = useRosterBuilds(
    rosterId,
    Route.useRouteContext().session.session.id
  )

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-20">
      <Button nativeButton={false} render={<Link to="/panel/my-builds" />}>
        Volver
      </Button>

      <ItemGroup>
        {builds.map((build) => {
          const resonator = build.resonator.data

          if (!resonator) return null

          return (
            <Link
              key={build.buildId}
              to="/panel/builder/$buildId"
              params={{ buildId: build.buildId }}
            >
              <Item variant="outline">
                <ItemMedia variant="image">
                  <img
                    src={resonator.icon}
                    alt={resonator.name}
                    className="size-full object-contain"
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{build.name}</ItemTitle>
                </ItemContent>
              </Item>
            </Link>
          )
        })}
      </ItemGroup>
    </div>
  )
}
