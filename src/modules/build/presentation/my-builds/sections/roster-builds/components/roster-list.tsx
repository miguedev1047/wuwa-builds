import type { UserRoster } from "@build/client/hooks/build-live-queries"
import { RosterItem } from "@build/presentation/my-builds/sections/roster-builds/components/roster-item"

type RosterListProps = {
  /** Resonator groups with at least one build. */
  rosters: readonly UserRoster[]
  /** Selects the roster that opens the builds Sheet. */
  onSelect: (resonatorId: number) => void
}

/** Grid of resonator portraits that open their build Sheet. */
export function RosterList({ rosters, onSelect }: RosterListProps) {
  return (
    <ul className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-8">
      {rosters.map((roster) => (
        <RosterItem
          key={roster.resonatorId}
          roster={roster}
          onSelect={onSelect}
        />
      ))}
    </ul>
  )
}
