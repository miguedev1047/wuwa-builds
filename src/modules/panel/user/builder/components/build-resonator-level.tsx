import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Slider } from "@/components/ui/slider"
import {
  LEVEL_MILESTONES,
  levelFromStep,
  stepFromLevel,
} from "@/modules/builds/domain/build"
import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import { statLabel } from "@/modules/game-data/application/stats/stats"
import { growthValueAtLevel } from "@/modules/game-data/domain/character"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { and, eq, useLiveSuspenseQuery } from "@tanstack/react-db"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams, useRouteContext } from "@tanstack/react-router"

export function BuildResonatorLevel() {
  const { session } = useRouteContext({ from: "/(panel)/panel" })

  const { buildId, rosterId } = useParams({
    from: "/(panel)/panel/builder/r/$rosterId/b/$buildId/",
  })
  const resonatorId = parseInt(rosterId)

  const { data: build } = useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) =>
        and(eq(build.buildId, buildId), eq(build.sessionId, session.session.id))
      )
      .findOne()
  )

  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  const handleLevelChange = (value: number | readonly number[]) => {
    const step = Array.isArray(value) ? value[0] : value

    if (typeof step !== "number") return

    buildCollection.update(buildId, (draft) => {
      draft.resonator.level = levelFromStep(step)
    })
  }

  const resonatorLevel = build?.resonator.level ?? 0
  const levelStep = stepFromLevel(resonatorLevel)

  const levelProperties = resonator.properties

  return (
    <Card>
      <CardHeader>
        <CardTitle>Niveles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Slider
            value={levelStep}
            max={LEVEL_MILESTONES.length - 1}
            min={0}
            onValueChange={handleLevelChange}
          />

          <ItemGroup>
            {levelProperties.slice(0, 3).map((level) => (
              <Item variant="muted" key={level.name}>
                <ItemMedia variant="image">
                  <img
                    src={level.icon}
                    alt={level.name}
                    className="size-full object-contain"
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{statLabel(level.name)}</ItemTitle>
                  <ItemDescription>
                    Valor: {growthValueAtLevel(level.growth, resonatorLevel)}
                  </ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </CardContent>
    </Card>
  )
}
