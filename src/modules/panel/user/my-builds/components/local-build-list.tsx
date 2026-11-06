import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import { useLiveSuspenseQuery, groupKeys, count, eq } from "@tanstack/react-db"
import { useRouteContext } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"

export function LocalBuildList() {
  const { session } = useRouteContext({ from: "/(panel)/panel" })

  const { data: builds } = useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .groupBy(
        groupKeys(({ build }) => [
          build.resonator.data.name,
          build.resonator.data.id,
          build.resonator.data.icon,
        ])
      )
      .select(({ build }) => ({
        name: build.resonator.data.name,
        resonatorId: build.resonator.data.id,
        icon: build.resonator.data.icon,
        totalBuilds: count(build.buildId),
      }))
      .where(({ build }) => eq(build.sessionId, session.session.id))
      .orderBy(({ build }) => build.createdAt, "asc")
  )

  return (
    <ItemGroup>
      {builds.map((build) => (
        <Link
          to="/panel/builder/r/$rosterId"
          params={{ rosterId: build.resonatorId.toString() }}
          key={build.resonatorId}
        >
          <Item variant="outline">
            <ItemMedia variant="image">
              <img
                src={build.icon}
                alt={build.name}
                className="size-full object-contain"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{build.name}</ItemTitle>
              <ItemDescription>
                Tiene {build.totalBuilds} builds
              </ItemDescription>
            </ItemContent>
          </Item>
        </Link>
      ))}
    </ItemGroup>
  )
}
