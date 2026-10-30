import { useSuspenseQuery } from "@tanstack/react-query"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { Show } from "@/components/utility/show"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { ResonatorItem } from "@/modules/panel/admin/game-data/views/resonators/components/resonator-item"

export function ResonatorList() {
  const { data: characters } = useSuspenseQuery(characterQueries.list())

  return (
    <Show
      when={characters.length}
      fallback={
        <Empty>
          <EmptyTitle>Sin datos</EmptyTitle>
          <EmptyDescription>Sin resonadores disponibles</EmptyDescription>
          <EmptyContent>
            <Button
              nativeButton={false}
              render={
                <Link to="/admin/resonators">
                  <HugeiconsIcon icon={PlusIcon} />
                  Nuevo resonador
                </Link>
              }
            />
          </EmptyContent>
        </Empty>
      }
    >
      <ul className="grid grid-cols-10">
        {characters.map((character) => (
          <ResonatorItem key={character.id} character={character} />
        ))}
      </ul>
    </Show>
  )
}
