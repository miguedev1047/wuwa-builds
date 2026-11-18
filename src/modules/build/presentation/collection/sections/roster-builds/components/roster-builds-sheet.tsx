import { Sheet } from "@/components/panelui/sheet"
import { Spinner } from "@/components/panelui/spinner"
import { Show } from "@/components/utility/show"
import type { SessionRoster } from "@build/client/hooks/build-live-queries"
import { RosterBuildsSheetContent } from "@build/presentation/collection/sections/roster-builds/components/roster-builds-sheet-content"
import { Suspense } from "react"

type RosterBuildsSheetProps = {
  /** Roster selected in the section; null when nothing is selected. */
  roster: SessionRoster | null
  /** Session that owns the local builds. */
  sessionId: string
  /** Whether the Sheet is open. */
  open: boolean
  /** Updates the Sheet open state. */
  onOpenChange: (open: boolean) => void
  /** Clears the selection once the close animation finishes. */
  onOpenChangeComplete: (open: boolean) => void
}

/** Sheet that lists the builds of the selected roster. */
export function RosterBuildsSheet({
  roster,
  sessionId,
  open,
  onOpenChange,
  onOpenChangeComplete,
}: RosterBuildsSheetProps) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
    >
      <Sheet.Content>
        <Show when={roster}>
          {(current) => (
            <>
              <Sheet.Header>
                <Sheet.Title>Builds de {current.name}</Sheet.Title>
              </Sheet.Header>
              <Sheet.Body>
                <Suspense fallback={<Spinner />}>
                  <RosterBuildsSheetContent
                    rosterId={current.resonatorId}
                    sessionId={sessionId}
                  />
                </Suspense>
              </Sheet.Body>
            </>
          )}
        </Show>
      </Sheet.Content>
    </Sheet>
  )
}
