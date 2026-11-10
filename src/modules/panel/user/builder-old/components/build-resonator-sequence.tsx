import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { updateBuild } from "@builds/client/build-store"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useParams } from "@tanstack/react-router"

export function BuildResonatorSequence() {
  const { buildId } = useParams({
    from: "/(panel)/panel/builder/$buildId/",
  })

  const { data: build } = useBuildCollection({ buildId })
  const sequency = build?.resonator.sequency ?? 0

  const handleSequencyChange = (value: number | readonly number[]) => {
    const next = Array.isArray(value) ? value[0] : value

    if (typeof next !== "number") return

    updateBuild(buildId, (current) => {
      current.resonator.sequency = next
      current.updateAt = new Date().toISOString()
    })
  }

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
