import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Switch } from "@/components/ui/switch"
import { Show } from "@/components/utility/show"
import type { ResonatorPassivesDataProps } from "@/modules/builds/infrastructure/local-storage/build-drafts"

interface BuildResonatorBonusItemProps {
  passive: ResonatorPassivesDataProps
  onEnabledChange: (enabled: boolean) => void
}

/** One resonator passive with its enable switch. */
export function BuildResonatorBonusItem({
  passive,
  onEnabledChange,
}: BuildResonatorBonusItemProps) {
  return (
    <Item variant="muted">
      <ItemMedia variant="image">
        <img
          src={passive.icon}
          alt={passive.name}
          className="size-full object-contain"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{passive.name}</ItemTitle>
        <Show when={passive.value > 0}>
          <ItemDescription>Valor: {passive.value}</ItemDescription>
        </Show>
      </ItemContent>
      <ItemActions>
        <Switch checked={passive.enabled} onCheckedChange={onEnabledChange} />
      </ItemActions>
    </Item>
  )
}
