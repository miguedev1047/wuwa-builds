import { RouteNavigation } from "@/components/blocks/route-navigation"
import type { SessionUser } from "@/lib/auth-client"
import { useBuildActions } from "@build/presentation/editor/hooks/use-build-actions"
import { RosterBuildsSection } from "@/modules/build/presentation/my-builds/sections/roster-builds"
import { UnassignedBuildsSection } from "@/modules/build/presentation/my-builds/sections/unassigned-builds"

type MyBuildsPageProps = {
  /** Signed-in user; owns the local builds and fills the greeting. */
  user: SessionUser
  /** Opens the editor after a new build has been created. */
  onCreated: (buildId: string) => Promise<void>
}

/** Local build library: header, creation action and both build sections. */
export function MyBuildsPage({ user, onCreated }: MyBuildsPageProps) {
  const { createBlankBuild, isCreating } = useBuildActions({ userId: user.id })

  return (
    <RouteNavigation.Root variant="extended">
      <RouteNavigation.Content>
        <div className="space-y-10">
          <RosterBuildsSection
            userId={user.id}
            onCreateBuild={() => createBlankBuild(onCreated)}
            isCreating={isCreating}
          />
          <UnassignedBuildsSection userId={user.id} />
        </div>
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}
