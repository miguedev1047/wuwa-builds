import type { EchoesDataProps } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import type { EchoSummary } from "@/modules/game-data/domain/echo"
import { echoQueries } from "@/modules/game-data/queries/echoes"
import { EchoItem } from "@/modules/panel/user/builder/components/echo-item"
import { useSuspenseQuery } from "@tanstack/react-query"

interface EchoesListProps {
  echoSlot: EchoesDataProps
  buildId: string
  onSelect: () => void
}

/** Echo picker content for one slot. */
export function EchoesList({ echoSlot, buildId, onSelect }: EchoesListProps) {
  const { data: echoes } = useSuspenseQuery(echoQueries.list())

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
