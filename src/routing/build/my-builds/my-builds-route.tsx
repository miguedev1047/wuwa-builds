import { MyBuildsPage } from "@/routing/build/my-builds/my-builds-page"
import type { SessionUser } from "@/lib/auth-client"
import { useNavigate } from "@tanstack/react-router"

/** Library screen with navigation to a newly created build. */
export function MyBuildsRoute({ user }: { user: SessionUser }) {
  const navigate = useNavigate()

  return (
    <MyBuildsPage
      user={user}
      onCreated={(buildId) =>
        navigate({
          to: "/panel/builder/$buildId",
          params: { buildId },
        })
      }
    />
  )
}
