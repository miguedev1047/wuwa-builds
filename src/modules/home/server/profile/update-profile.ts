import { authMiddleware } from "@/functions/middlewares"
import { profileUpdateInput } from "@home/application/profile/profile-update"
import { createServerFn } from "@tanstack/react-start"

/** Saves editable profile settings for the authenticated account. */
export const updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(profileUpdateInput)
  .handler(async ({ context, data }) => {
    const { saveProfile } =
      await import("@home/infrastructure/profile/profile-repository.server")
    await saveProfile(context.session.user.id, data)
  })
