import { profileViewerInput } from "@home/application/profile/profile-lookup"
import { createServerFn } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"

/** Returns the roster summaries the current visitor is allowed to see. */
export const getProfileRosters = createServerFn({ method: "GET" })
  .validator(profileViewerInput)
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "private, no-store")
    const [{ getSession }, { readProfileRosters }, { db }] = await Promise.all([
      import("@/functions/auth"),
      import("@home/infrastructure/profile/profile-roster-repository.server"),
      import("@/db"),
    ])

    const viewerId = (await getSession())?.user.id
    if (data.viewerId !== undefined && data.viewerId !== (viewerId ?? null))
      return []

    return readProfileRosters(db, data.userId, viewerId)
  })
