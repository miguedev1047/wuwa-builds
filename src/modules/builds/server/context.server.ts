import { getRequestHeaders } from "@tanstack/react-start/server"
import { auth } from "@/lib/auth"
import { d1BuildRepository } from "../infrastructure/d1/build-repository.server"

/**
 * Server-side request context for build use cases.
 *
 * The owner always comes from the Better Auth session, never from the client.
 */
export async function buildContext() {
  const session = await auth.api.getSession({ headers: getRequestHeaders() })

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  return {
    userId: session.user.id,
    repository: d1BuildRepository,
  }
}
