import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { echoQueries } from "@game-data/queries/echoes"
import { EchoSlot } from "@panel/user/builder-old/components/echo-slot"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"

export function EchoesSelectorDialog() {
  const { buildId } = useParams({
    from: "/(panel)/panel/builder/$buildId/",
  })

  const { data: build } = useBuildCollection({ buildId })

  const buildEchoes = build?.echoes ?? []
  const echoIds = [
    ...new Set(
      buildEchoes.flatMap((echo) => (echo.data ? [echo.data.id] : []))
    ),
  ]

  const { data: echoDetails, isLoading: isLoadingEchoDetails } = useQuery(
    echoQueries.details(echoIds)
  )
  const echoDetailById = new Map(
    (echoDetails ?? []).map((echo) => [echo.id, echo])
  )

  if (!build) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ecos</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="grid grid-cols-1 gap-4">
          {buildEchoes.map((echo) => (
            <li key={echo.index}>
              <EchoSlot
                echo={echo}
                buildId={buildId}
                isMain={build.mainEchoSlot === echo.index}
                echoDetail={
                  echo.data ? echoDetailById.get(echo.data.id) : undefined
                }
                isLoadingEchoDetail={isLoadingEchoDetails}
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
