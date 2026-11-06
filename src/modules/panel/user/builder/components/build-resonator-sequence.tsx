import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import { and, eq, useLiveSuspenseQuery } from "@tanstack/react-db"
import { useParams, useRouteContext } from "@tanstack/react-router"

export function BuildResonatorSequence() {
  const { session } = useRouteContext({ from: "/(panel)/panel" })

  const { buildId } = useParams({
    from: "/(panel)/panel/builder/r/$rosterId/b/$buildId/",
  })

  const { data: build } = useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) =>
        and(eq(build.buildId, buildId), eq(build.sessionId, session.session.id))
      )
      .findOne()
  )

  const handleSequencyChange = (value: number | readonly number[]) => {
    if (value) {
      buildCollection.update(buildId, (current) => {
        current.resonator.sequency = value as number
      })
    } else {
      buildCollection.update(buildId, (current) => {
        current.resonator.sequency = 0
      })
    }
  }

  const sequency = build?.resonator.sequency ?? 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secuencia - {sequency}</CardTitle>
      </CardHeader>
      <CardContent>
        <Slider
          value={sequency}
          max={6}
          min={0}
          onValueChange={handleSequencyChange}
        />
      </CardContent>
    </Card>
  )
}
