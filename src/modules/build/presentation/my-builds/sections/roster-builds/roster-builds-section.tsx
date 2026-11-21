import { RouteNavigation } from "@/components/blocks/route-navigation"
import { Spinner } from "@/components/panelui/spinner"
import { RosterBuildsSectionContent } from "@build/presentation/my-builds/sections/roster-builds/components/roster-builds-section-content"
import { Suspense } from "react"
import { CreateBuildButton } from "@build/presentation/my-builds/sections/roster-builds/components/create-build-button"

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
          <CreateBuildButton
            isCreating={isCreating}
            onCreateBuild={onCreateBuild}
          />
        </RouteNavigation.Actions>
      </RouteNavigation.Header>
      <Suspense fallback={<Spinner />}>
        <RosterBuildsSectionContent userId={userId} />
      </Suspense>
    </section>
  )
}
