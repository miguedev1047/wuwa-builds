import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { buildCollection } from "@/modules/builds/client/build-store"
import {
  and,
  count,
  eq,
  groupKeys,
  isNull,
  not,
  useLiveSuspenseQuery,
} from "@tanstack/react-db"
import { Link, useRouteContext } from "@tanstack/react-router"

export function LocalBuildList() {
  const { session } = useRouteContext({ from: "/(panel)/panel" })

  const { data: rosters } = useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) =>
        and(
          eq(build.sessionId, session.session.id),
          not(isNull(build.resonator.data))
        )
      )
      .groupBy(
        groupKeys(({ build }) => [
          build.resonator.data!.id,
          build.resonator.data!.name,
          build.resonator.data!.icon,
        ])
      )
      .select(({ build }) => ({
        resonatorId: build.resonator.data!.id,
        name: build.resonator.data!.name,
        icon: build.resonator.data!.icon,
        totalBuilds: count(build.buildId),
      }))
  )

  const { data: unassigned } = useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) =>
        and(
          eq(build.sessionId, session.session.id),
          isNull(build.resonator.data)
        )
      )
      .orderBy(({ build }) => build.createdAt, "asc")
  )

  if (rosters.length === 0 && unassigned.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Todavía no hay builds.</p>
    )
  }

  return (
    <div className="space-y-6">
      {rosters.length > 0 && (
        <section className="space-y-2">
          <h4 className="text-sm font-medium">Rosters</h4>

          <ItemGroup>
            {rosters.map((roster) => (
              <Link
                key={roster.resonatorId}
                to="/panel/builder/r/$rosterId"
                params={{ rosterId: roster.resonatorId.toString() }}
              >
                <Item variant="outline">
                  <ItemMedia variant="image">
                    <img
                      src={roster.icon}
                      alt={roster.name}
                      className="size-full object-contain"
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{roster.name}</ItemTitle>
                    <ItemDescription>
                      Tiene {roster.totalBuilds} builds
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </Link>
            ))}
          </ItemGroup>
        </section>
      )}

      {unassigned.length > 0 && (
        <section className="space-y-2">
          <h4 className="text-sm font-medium">Sin resonador</h4>

          <ItemGroup>
            {unassigned.map((build) => (
              <Link
                key={build.buildId}
                to="/panel/builder/$buildId"
                params={{ buildId: build.buildId }}
              >
                <Item variant="outline">
                  <ItemContent>
                    <ItemTitle>{build.name}</ItemTitle>
                    <ItemDescription>
                      Sin resonador seleccionado
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </Link>
            ))}
          </ItemGroup>
        </section>
      )}
    </div>
  )
}
