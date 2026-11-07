import { useParams } from "@tanstack/react-router"
import { useBuildCollection } from "@/modules/panel/user/builder/application/builder"
import { useSuspenseQuery } from "@tanstack/react-query"
import { weaponQueries } from "@/modules/game-data/queries/weapons"
import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export function BuildWeaponRefinaments() {
  const { buildId } = useParams({
    from: "/(panel)/panel/builder/r/$rosterId/b/$buildId/",
  })

  const { data: build } = useBuildCollection({ buildId })

  const weaponId = build?.weapon.data?.id ?? 0

  const { data: weapon } = useSuspenseQuery(weaponQueries.detail(weaponId))

  const handleRefinamentChange = (value: number | readonly number[]) => {
    if (value) {
      buildCollection.update(buildId, (current) => {
        current.weapon.refinament = value as number
      })
    }
  }

  const refinament = build?.weapon.refinament ?? 0
  const refinamentEffect = weapon.refinements[refinament - 1].effect

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secuencia</CardTitle>
        <Badge>Refinamiento {refinament}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Slider
            value={refinament}
            max={5}
            min={1}
            onValueChange={handleRefinamentChange}
          />

          <div dangerouslySetInnerHTML={{ __html: refinamentEffect }} />
        </div>
      </CardContent>
    </Card>
  )
}
