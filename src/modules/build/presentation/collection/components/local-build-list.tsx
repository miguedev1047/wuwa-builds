import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  useSessionRosters,
  useUnassignedBuilds,
} from "@build/client/hooks/build-live-queries"
import type { ComponentType, ReactNode } from "react"

/** Lists builds using navigation slots supplied by the host. */
export function LocalBuildList({
  sessionId,
  RosterLink,
  BuildLink,
}: {
  sessionId: string
  RosterLink: ComponentType<{ id: number; children: ReactNode }>
  BuildLink: ComponentType<{ id: string; children: ReactNode }>
}) {
  const { data: rosters } = useSessionRosters(sessionId)
  const { data: unassigned } = useUnassignedBuilds(sessionId)

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
              <RosterLink key={roster.resonatorId} id={roster.resonatorId}>
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
              </RosterLink>
            ))}
          </ItemGroup>
        </section>
      )}

      {unassigned.length > 0 && (
        <section className="space-y-2">
          <h4 className="text-sm font-medium">Sin resonador</h4>

          <ItemGroup>
            {unassigned.map((build) => (
              <BuildLink key={build.buildId} id={build.buildId}>
                <Item variant="outline">
                  <ItemContent>
                    <ItemTitle>{build.name}</ItemTitle>
                    <ItemDescription>
                      Sin resonador seleccionado
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </BuildLink>
            ))}
          </ItemGroup>
        </section>
      )}
    </div>
  )
}
