import { RouteNavigation } from "@/components/blocks/route-navigation"
import { Button } from "@/components/panelui/button"
import { Spinner } from "@/components/panelui/spinner"
import { RosterBuildsSectionContent } from "@build/presentation/my-builds/sections/roster-builds/components/roster-builds-section-content"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Suspense } from "react"

type RosterBuildsSectionProps = {
  /** User that owns the local builds. */
  userId: string
  onCreateBuild: () => void
  /** Whether the create action is saving the build or opening the editor. */
  isCreating: boolean
}

/** Builds grouped by their resonator, under their own section header. */
export function RosterBuildsSection({
  userId,
  isCreating,
  onCreateBuild,
}: RosterBuildsSectionProps) {
  return (
    <section className="space-y-10">
      <RouteNavigation.Header>
        <RouteNavigation.Title>Mis builds</RouteNavigation.Title>
        <RouteNavigation.Description>
          Todas tus builds guardadas en tu cuenta.
        </RouteNavigation.Description>
        <RouteNavigation.Actions>
          <Button
            loading={isCreating}
            aria-label={isCreating ? "Creando build" : undefined}
            onClick={onCreateBuild}
          >
            <HugeiconsIcon icon={PlusIcon} />
            Nueva Build
          </Button>
        </RouteNavigation.Actions>
      </RouteNavigation.Header>
      <Suspense fallback={<Spinner />}>
        <RosterBuildsSectionContent userId={userId} />
      </Suspense>
    </section>
  )
}
