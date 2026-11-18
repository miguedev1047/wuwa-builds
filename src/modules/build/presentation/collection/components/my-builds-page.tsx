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
    <div className="w-full space-y-10 pb-10">
      <header className="flex flex-wrap items-end justify-between gap-3 px-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">
            Tus <span className="text-primary">resonadores</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Todos tus resonadores aparecen aquí
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
          <RosterBuildsSection userId={user.id} />
          <UnassignedBuildsSection userId={user.id} />
        </div>
      </Show>
    </div>
  )
}
