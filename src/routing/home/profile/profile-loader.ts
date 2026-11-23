import { profileQueries } from "@home/queries/profile"
import type { QueryClient } from "@tanstack/react-query"

/** Load the profile into the query cache and report whether it is visible. */
export function loadProfileAccess(
  queryClient: QueryClient,
  userId: string,
  viewerId: string | null
): Promise<boolean> {
  return queryClient
    .query(profileQueries.detail(userId, viewerId))
    .then(Boolean)
}

/** Preload the rosters once the profile is visible to the viewer. */
export async function preloadProfileRosters(
  queryClient: QueryClient,
  userId: string,
  viewerId: string | null,
  profileReady: Promise<boolean>
): Promise<boolean> {
  try {
    if (!(await profileReady)) return false

    await queryClient.query(profileQueries.rosters(userId, viewerId))
    return true
  } catch {
    return false
  }
}
