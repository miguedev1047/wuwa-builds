import { profileRosterLookupInput } from "@home/application/profile/profile-lookup"
import { createServerFn } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"

/** Returns read-only build cards without exposing the stored documents. */
export const getProfileRosterCards = createServerFn({ method: "GET" })
  .validator(profileRosterLookupInput)
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "private, no-store")
    const [{ getSession }, { readProfileRosterCards }, { db }] =
      await Promise.all([
        import("@/functions/auth"),
        import("@home/infrastructure/profile/read-profile-roster-cards.server"),
        import("@/db"),
      ])

    const viewerId = (await getSession())?.user.id
    if (data.viewerId !== undefined && data.viewerId !== (viewerId ?? null))
      return []

    return readProfileRosterCards(db, data.userId, data.characterId, viewerId)
  })
