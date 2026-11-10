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
import { Spinner } from "@/components/ui/spinner"
import { updateBuild } from "@builds/client/build-store"
import {
  LEVEL_MILESTONES,
  levelFromStep,
  stepFromLevel,
} from "@builds/domain/build"
import { statLabel } from "@game-data/application/stats/stats"
import { growthValueAtLevel } from "@game-data/domain/character"
import { characterQueries } from "@game-data/queries/characters"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"

export function BuildResonatorLevel() {
  const { buildId } = useParams({
    from: "/(panel)/panel/builder/$buildId/",
  })

  const { data: build } = useBuildCollection({ buildId })
  const resonatorId = build?.resonator.data?.id

  const { data: resonator, isLoading } = useQuery({
    ...characterQueries.detail(resonatorId ?? 0),
    enabled: resonatorId !== undefined,
  })

  const handleLevelChange = (value: number | readonly number[]) => {
    const step = Array.isArray(value) ? value[0] : value

    if (typeof step !== "number") return

    updateBuild(buildId, (draft) => {
      draft.resonator.level = levelFromStep(step)
      draft.updateAt = new Date().toISOString()
    })
  }

  const resonatorLevel = build?.resonator.level ?? 0
  const levelStep = stepFromLevel(resonatorLevel)
  const levelProperties = resonator?.properties ?? []

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

          {isLoading ? (
            <Spinner />
          ) : (
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
          )}
        </div>
      </CardContent>
    </Card>
  )
}
