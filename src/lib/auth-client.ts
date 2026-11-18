import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/client"
import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
})

/** Authenticated user as exposed by Better Auth, `role` included. */
export type SessionUser = typeof authClient.$Infer.Session.user
