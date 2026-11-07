import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useBuildCollection } from "@/modules/panel/user/builder/application/builder"
import { weaponQueries } from "@/modules/game-data/queries/weapons"
import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import {
  LEVEL_MILESTONES,
  levelFromStep,
  stepFromLevel,
} from "@/modules/builds/domain/build"
import { Slider } from "@/components/ui/slider"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { statLabel } from "@/modules/game-data/application/stats/stats"
import { growthValueAtLevel } from "@/modules/game-data/domain/character"
import { Badge } from "@/components/ui/badge"

export function WeaponLevel() {
  const { buildId } = useParams({
    from: "/(panel)/panel/builder/r/$rosterId/b/$buildId/",
  })

  const { data: build } = useBuildCollection({ buildId })

  const weaponId = build?.weapon.data?.id ?? 0

  const { data: weapon } = useSuspenseQuery(weaponQueries.detail(weaponId))

  const handleLevelChange = (value: number | readonly number[]) => {
    const step = Array.isArray(value) ? value[0] : value

    if (typeof step !== "number") return

    buildCollection.update(buildId, (draft) => {
      draft.weapon.level = levelFromStep(step)
    })
  }

  const weaponLevel = build?.weapon.level ?? 0
  const levelStep = stepFromLevel(weaponLevel)

  const levelProperties = weapon.properties

  return (
    <Card>
      <CardHeader>
        <CardTitle>Niveles</CardTitle>
        <Badge variant="outline">Nivel: {weaponLevel}</Badge>
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
            {levelProperties.map((level) => (
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
                    Valor: {growthValueAtLevel(level.growth, weaponLevel)}
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
