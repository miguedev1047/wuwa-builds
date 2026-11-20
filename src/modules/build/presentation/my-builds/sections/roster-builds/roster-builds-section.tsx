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
}

/** Builds grouped by their resonator, under their own section header. */
export function RosterBuildsSection({
  userId,
  onCreateBuild,
}: RosterBuildsSectionProps) {
  return (
    <section className="space-y-10">
      <RouteNavigation.Header>
        <RouteNavigation.Title>Mis builds</RouteNavigation.Title>
        <RouteNavigation.Description>
          Todas tus builds guardadas en este navegador.
        </RouteNavigation.Description>
        <RouteNavigation.Actions>
          <Button onClick={onCreateBuild}>
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
