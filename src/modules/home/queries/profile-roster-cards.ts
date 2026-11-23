import type { ProfileRoster } from "@home/domain/profile-roster"
import { getProfileRosterCards } from "@home/server/profile/get-profile-roster-cards"
import { queryOptions } from "@tanstack/react-query"

/** Caches prepared cards for one visitor and the current version of a roster. */
export function profileRosterCardsOptions(
  userId: string,
  viewerId: string | null,
  roster: ProfileRoster
) {
  const { characterId, builds } = roster
  return queryOptions({
    queryKey: [
      "profile-roster-cards",
      userId,
      viewerId,
      characterId,
      builds.map(({ buildId, updatedAt }) => [buildId, updatedAt]),
    ],
    queryFn: () =>
      getProfileRosterCards({ data: { userId, viewerId, characterId } }),
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false,
  })
}
