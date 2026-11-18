import { Button } from "@/components/panelui/button"
import { Show } from "@/components/utility/show"
import type { SessionUser } from "@/lib/auth-client"
import { MAX_LOCAL_BUILDS } from "@build/domain/build"
import { BuildsEmpty } from "@build/presentation/collection/components/builds-empty"
import { useCreateBuild } from "@build/presentation/collection/hooks/use-create-build"
import { RosterBuildsSection } from "@build/presentation/collection/sections/roster-builds"
import { UnassignedBuildsSection } from "@build/presentation/collection/sections/unassigned-builds"
import { UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type MyBuildsPageProps = {
  /** Session that owns the local builds. */
  sessionId: string
  /** Session user, shown in the page greeting and in the app navigation. */
  user: SessionUser
  /** Opens the editor after a new build has been created. */
  onCreated: (buildId: string) => void
}

/** Local build library: header, creation action and both build sections. */
export function MyBuildsPage({
  sessionId,
  user,
  onCreated,
}: MyBuildsPageProps) {
  const { buildCount, createBuild } = useCreateBuild(sessionId, onCreated)

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h2>Hola {user.name}. Bienvenido al panel.</h2>
          <p className="text-xs text-muted-foreground">
            {buildCount}/{MAX_LOCAL_BUILDS} builds
          </p>
        </div>
        <Button onClick={createBuild}>Nueva Build</Button>
      </header>

      <Show
        when={buildCount > 0}
        fallback={
          <BuildsEmpty
            icon={<HugeiconsIcon icon={UserIcon} />}
            title="Todavía no hay builds"
            description="Crea una build para empezar a configurar un resonador."
          />
        }
      >
        <div className="space-y-6">
          <RosterBuildsSection sessionId={sessionId} />
          <UnassignedBuildsSection sessionId={sessionId} />
        </div>
      </Show>
    </div>
  )
}
