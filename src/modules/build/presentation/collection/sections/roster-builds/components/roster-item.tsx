import { Tooltip } from "@/components/panelui/tooltip"
import { Image } from "@/components/ui/image"
import type { SessionRoster } from "@build/client/hooks/build-live-queries"

type RosterItemProps = {
  /** Resonator group with at least one build. */
  roster: SessionRoster
  /** Selects this roster and opens its builds Sheet. */
  onSelect: (resonatorId: number) => void
}

/** Portrait button for one resonator group. */
export function RosterItem({ roster, onSelect }: RosterItemProps) {
  return (
    <li>
      <Tooltip>
        <Tooltip.Trigger
          render={
            <button
              type="button"
              aria-label={roster.name}
              className="block w-full"
              onClick={() => onSelect(roster.resonatorId)}
            >
              <Image
                src={roster.iconLarge}
                alt=""
                background="accent"
                aspect="portrait"
                size="full"
                hover="lift"
              />
            </button>
          }
        />
        <Tooltip.Content>{roster.name}</Tooltip.Content>
      </Tooltip>
    </li>
  )
}
