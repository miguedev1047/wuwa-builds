import { Show } from "@/components/utility/show"
import type { CharacterSummary } from "@/modules/game-data/domain/character"

interface ResonatorItemProps {
  resonator: CharacterSummary
  isPending: boolean
  isBusy: boolean
  onSelect: (resonator: CharacterSummary) => void
  onPreload?: (resonator: CharacterSummary) => void
}

/** Resonator card: it only renders the summary and emits the selection. */
export function ResonatorItem({
  resonator,
  isPending,
  isBusy,
  onSelect,
  onPreload,
}: ResonatorItemProps) {
  const image = resonator.iconLarge || resonator.icon
  const preload = () => onPreload?.(resonator)

  return (
    <button
      type="button"
      aria-label={resonator.name}
      data-pending={isPending}
      disabled={isBusy}
      onMouseEnter={preload}
      onFocus={preload}
      onTouchStart={preload}
      onClick={() => onSelect(resonator)}
      title={resonator.name}
      className="aspect-2/3 w-full overflow-hidden border border-transparent bg-accent data-[pending=true]:opacity-50 disabled:pointer-events-none disabled:opacity-50"
    >
      <Show when={image}>
        {(src) => (
          <img
            src={src}
            alt={resonator.name}
            className="size-full object-cover transition-transform ease-in-out hover:scale-105"
          />
        )}
      </Show>
    </button>
  )
}
