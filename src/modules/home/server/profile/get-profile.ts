import { profileViewerInput } from "@home/application/profile/profile-lookup"
import { createServerFn } from "@tanstack/react-start"
import {
  setResponseHeader,
  setResponseStatus,
} from "@tanstack/react-start/server"

/** Reads an allowed profile by its account ID. */
export const getProfile = createServerFn({ method: "GET" })
  .validator(profileViewerInput)
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "private, no-store")
    const [{ getSession }, { readProfile }] = await Promise.all([
      import("@/functions/auth"),
      import("@home/infrastructure/profile/profile-repository.server"),
    ])
    const viewerId = (await getSession())?.user.id
    if (data.viewerId !== undefined && data.viewerId !== (viewerId ?? null)) {
      setResponseStatus(404)
      return null
    }

    const profile = await readProfile(data.userId, viewerId)
    if (!profile) setResponseStatus(404)
    return profile
  })
