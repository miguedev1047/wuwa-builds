import { Button } from "@/components/panelui/button"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Show } from "@/components/utility/show"
import type { ProfileRoster } from "@home/domain/profile-roster"
import { RosterBuildItem } from "@home/presentation/profile/components/roster-build-item"
import { profileRosterCardsOptions } from "@home/queries/profile-roster-cards"
import { useQuery } from "@tanstack/react-query"

type RosterListProps = {
  /** Profile account and current visitor for the query cache. */
  userId: string
  viewerId: string | null
  /** Selected resonator and its saved builds. */
  roster: ProfileRoster
}

/** Loads one roster and displays its saved builds. */
export function RosterList({ userId, viewerId, roster }: RosterListProps) {
  const { data, isPending, isError, isFetching, refetch } = useQuery(
    profileRosterCardsOptions(userId, viewerId, roster)
  )
  const cards = new Map(data?.map((card) => [card.buildId, card]))

  return (
    <div className="min-w-0 space-y-4">
      <Show when={isError}>
        <Empty className="h-80 border border-dashed">
          <EmptyHeader>
            <EmptyTitle>No se pudieron cargar las tarjetas.</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              loading={isFetching}
              onClick={() => void refetch()}
            >
              Reintentar
            </Button>
          </EmptyContent>
        </Empty>
      </Show>
      <ul aria-label={`Builds de ${roster.name}`} className="space-y-8">
        {roster.builds.map((summary) => (
          <RosterBuildItem
            key={summary.buildId}
            summary={summary}
            card={cards.get(summary.buildId)}
            pending={isPending || (isFetching && !data)}
            failed={isError}
          />
        ))}
      </ul>
    </div>
  )
}
