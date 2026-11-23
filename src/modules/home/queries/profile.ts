import { getProfile } from "@home/server/profile/get-profile"
import { getProfileRosters } from "@home/server/profile/get-profile-rosters"
import { queryOptions } from "@tanstack/react-query"

const profileNavigationPolicy = {
  staleTime: 0,
  gcTime: 5 * 60 * 1000,
  refetchOnMount: false,
  retry: false,
} as const

const profileDetailKey = (userId: string) =>
  ["profile", "detail", userId] as const

/** Shared options for route preloads and the profile sections. */
export const profileQueries = {
  detailKey: profileDetailKey,
  detail: (userId: string, viewerId: string | null) =>
    queryOptions({
      ...profileNavigationPolicy,
      queryKey: [...profileDetailKey(userId), viewerId],
      queryFn: () => getProfile({ data: { userId, viewerId } }),
    }),
  rosters: (userId: string, viewerId: string | null) =>
    queryOptions({
      ...profileNavigationPolicy,
      queryKey: ["profile", "rosters", userId, viewerId],
      queryFn: () => getProfileRosters({ data: { userId, viewerId } }),
    }),
}
