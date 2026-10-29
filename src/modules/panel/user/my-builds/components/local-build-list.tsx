import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { Show } from "@/components/utility/show"
import { formatDate } from "@/lib/format-date"
import {
  useBuildDraftCollection,
  type BuildDraftCollection,
} from "@/modules/builds/client/build-drafts-provider"
import { characterQueries } from "@/modules/encore/queries/characters"
import { DeleteIcon, ListIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLiveQuery } from "@tanstack/react-db"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"

export function LocalBuildList() {
  const collection = useBuildDraftCollection()

  if (!collection) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  return <LocalBuildListContent collection={collection} />
}

function LocalBuildListContent({
  collection,
}: {
  collection: BuildDraftCollection
}) {
  const { data: drafts } = useLiveQuery((q) => q.from({ draft: collection }))
  const { data: characters } = useSuspenseQuery(characterQueries.list())

  const characterById = new Map(
    characters.map((character) => [character.id, character])
  )
  const sortedDrafts = [...drafts].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  )

  if (sortedDrafts.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={ListIcon} />
        </EmptyMedia>
        <EmptyTitle>No hay borradores</EmptyTitle>
        <EmptyDescription>
          Crea una build para empezar a guardar tus configuraciones.
        </EmptyDescription>
        <EmptyContent>
          <Button nativeButton={false} render={<Link to="/panel/new-build" />}>
            Nueva Build
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <ul className="space-y-2">
      {sortedDrafts.map((draft) => {
        const character = characterById.get(draft.characterId)

        return (
          <Item
            key={draft.id}
            variant="muted"
            className="flex items-center justify-between gap-4 rounded-md border p-3"
          >
            <Link to="/panel/builder/$draftId" params={{ draftId: draft.id }}>
              <ItemMedia variant="image">
                <Show when={character?.icon}>
                  {(icon) => (
                    <img
                      src={icon}
                      alt={character?.name}
                      className="size-full rounded-full object-cover"
                    />
                  )}
                </Show>
              </ItemMedia>
            </Link>
            <ItemContent>
              <Link to="/panel/builder/$draftId" params={{ draftId: draft.id }}>
                <ItemTitle className="block truncate font-medium hover:underline">
                  {draft.name || "Sin nombre"} -{" "}
                  {character?.name ?? `Personaje ${draft.characterId}`}
                </ItemTitle>
              </Link>

              <ItemDescription className="block text-xs opacity-60">
                Actualizado {formatDate(draft.updatedAt)}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => collection.delete(draft.id)}
              >
                <HugeiconsIcon icon={DeleteIcon} />
              </Button>
            </ItemActions>
          </Item>
        )
      })}
    </ul>
  )
}
