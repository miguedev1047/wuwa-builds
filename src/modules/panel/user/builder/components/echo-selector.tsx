import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EchoSlot } from "@/modules/panel/user/builder/components/echo-slot"
import { useBuildCollection } from "@/modules/panel/user/builder/application/builder"
import { useParams } from "@tanstack/react-router"

export function EchoesSelectorDialog() {
  const { buildId } = useParams({
    from: "/(panel)/panel/builder/$buildId/",
  })

  const { data: build } = useBuildCollection({ buildId })

  if (!build) return null

  const buildEchoes = build.echoes ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ecos</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="grid grid-cols-1 gap-4">
          {buildEchoes.map((echo) => (
            <li key={echo.index}>
              <EchoSlot echo={echo} buildId={buildId} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
