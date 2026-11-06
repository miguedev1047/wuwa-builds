import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Show } from "@/components/utility/show"
import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import { and, eq, useLiveSuspenseQuery } from "@tanstack/react-db"
import { Link, useParams, useRouteContext } from "@tanstack/react-router"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/panel/builder/r/$rosterId/")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const { session } = useRouteContext({ from: "/(panel)/panel" })
  const params = useParams({ from: "/(panel)/panel/builder/r/$rosterId/" })
  const rosterId = parseInt(params.rosterId)

  const { data: builds } = useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) =>
        and(
          eq(build.resonator.data.id, rosterId),
          eq(build.sessionId, session.session.id)
        )
      )
      .orderBy(({ build }) => build.createdAt, "asc")
  )

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-20">
      <Button nativeButton={false} render={<Link to="/panel/my-builds" />}>
        Volver
      </Button>
      <ItemGroup>
        {builds.map((build, _) => (
          <Show key={build.buildId} when={build.resonator}>
            {({ data: resonator }) => (
              <Link
                to="/panel/builder/r/$rosterId/b/$buildId"
                params={{
                  rosterId: resonator.id.toString(),
                  buildId: build.buildId,
                }}
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
            )}
          </Show>
        ))}
      </ItemGroup>
    </div>
  )
}
