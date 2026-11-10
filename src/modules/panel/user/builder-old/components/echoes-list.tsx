import type { EchoesDataProps } from "@builds/domain/build-record"
import type { EchoSummary } from "@game-data/domain/echo"
import { echoQueries } from "@game-data/queries/echoes"
import { EchoItem } from "@panel/user/builder-old/components/echo-item"
import { useSuspenseQuery } from "@tanstack/react-query"

interface EchoesListProps {
  echoSlot: EchoesDataProps
  buildId: string
  onSelect: () => void
}

/** Echo picker content for one slot. */
export function EchoesList({ echoSlot, buildId, onSelect }: EchoesListProps) {
  const { data: echoes } = useSuspenseQuery(echoQueries.list())

  if (echoes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay ecos en el catálogo.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-4 gap-4">
      {echoes.map((echo: EchoSummary) => (
        <EchoItem
          key={echo.id}
          echo={echo}
          echoSlot={echoSlot}
          buildId={buildId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  )
}
