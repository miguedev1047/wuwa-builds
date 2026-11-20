import { RouteNavigation } from "@/components/blocks/route-navigation"
import type { SessionUser } from "@/lib/auth-client"
import { useCreateBuild } from "@/modules/build/presentation/my-builds/hooks/use-create-build"
import { RosterBuildsSection } from "@/modules/build/presentation/my-builds/sections/roster-builds"
import { UnassignedBuildsSection } from "@/modules/build/presentation/my-builds/sections/unassigned-builds"

type MyBuildsPageProps = {
  /** Signed-in user; owns the local builds and fills the greeting. */
  user: SessionUser
  /** Opens the editor after a new build has been created. */
  onCreated: (buildId: string) => void
}

/** Local build library: header, creation action and both build sections. */
export function MyBuildsPage({ user, onCreated }: MyBuildsPageProps) {
  const { createBuild } = useCreateBuild(user.id, onCreated)

  return (
    <RouteNavigation.Root variant="extended">
      <RouteNavigation.Content>
        <div className="space-y-10">
          <RosterBuildsSection userId={user.id} onCreateBuild={createBuild} />
          <UnassignedBuildsSection userId={user.id} />
        </div>
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}
