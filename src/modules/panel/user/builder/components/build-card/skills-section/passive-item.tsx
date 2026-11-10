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
import type { ResonatorPassivesDataProps } from "@builds/domain/build-record"

type PassiveItemProps = {
  passive: ResonatorPassivesDataProps
  onEnabledChange: (enabled: boolean) => void
}

/** One resonator passive with its enable switch. */
export function PassiveItem({ passive, onEnabledChange }: PassiveItemProps) {
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
