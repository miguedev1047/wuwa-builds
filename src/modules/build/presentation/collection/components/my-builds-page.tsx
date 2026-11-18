import { RouteNavigation } from "@/components/blocks/route-navigation"
import { Button } from "@/components/panelui/button"
import { Show } from "@/components/utility/show"
import type { SessionUser } from "@/lib/auth-client"
import { BuildsEmpty } from "@build/presentation/collection/components/builds-empty"
import { useCreateBuild } from "@build/presentation/collection/hooks/use-create-build"
import { RosterBuildsSection } from "@build/presentation/collection/sections/roster-builds"
import { UnassignedBuildsSection } from "@build/presentation/collection/sections/unassigned-builds"
import { UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type MyBuildsPageProps = {
  /** Signed-in user; owns the local builds and fills the greeting. */
  user: SessionUser
  /** Opens the editor after a new build has been created. */
  onCreated: (buildId: string) => void
}

/** Local build library: header, creation action and both build sections. */
export function MyBuildsPage({ user, onCreated }: MyBuildsPageProps) {
  const { buildCount, createBuild } = useCreateBuild(user.id, onCreated)

  return (
    <RouteNavigation.Root variant="extended">
      <RouteNavigation.Content>
        <Show
          when={buildCount > 0}
          fallback={
            <BuildsEmpty
              className="mx-4 md:mx-8"
              icon={<HugeiconsIcon icon={UserIcon} />}
              title="Todavía no hay builds"
              description="Crea una build para empezar a configurar un resonador."
              action={<Button onClick={createBuild}>Nueva Build</Button>}
            />
          }
        >
          <div className="space-y-10">
            <RosterBuildsSection userId={user.id} onCreateBuild={createBuild} />
            <UnassignedBuildsSection userId={user.id} />
          </div>
        </Show>
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}
