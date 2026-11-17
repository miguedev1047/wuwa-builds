import { Badge } from "@/components/panelui/badge"
import { Show } from "@/components/utility/show"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { characterQueries } from "@catalog/queries/characters"
import { useSuspenseQuery } from "@tanstack/react-query"

type ResonatorBestWeaponsContentProps = {
  resonatorId: number
}

/** Ranked weapon recommendations using the joined catalog weapon data. */
export function ResonatorBestWeaponsContent({
  resonatorId,
}: ResonatorBestWeaponsContentProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  return (
    <EditableSection.Content>
      <EditableSection.List
        items={resonator.bestWeapons}
        getItemKey={(bestWeapon) => bestWeapon.id}
        empty={
          <EditableSection.Text>Sin armas recomendadas.</EditableSection.Text>
        }
      >
        {(bestWeapon, index) => (
          <EditableSection.Item>
            <EditableSection.Media variant="image">
              <Show when={bestWeapon.weapon?.icon}>
                {(icon) => <EditableSection.Image src={icon} alt="" />}
              </Show>
            </EditableSection.Media>
            <EditableSection.ItemContent>
              <EditableSection.ItemTitle>
                <Show
                  when={bestWeapon.weapon}
                  fallback="Arma no disponible en el catálogo"
                >
                  {(weapon) => weapon.name}
                </Show>
              </EditableSection.ItemTitle>
              <EditableSection.ItemDescription>
                <Show when={bestWeapon.weapon}>
                  {(weapon) => `${weapon.rarity} estrellas`}
                </Show>
              </EditableSection.ItemDescription>
            </EditableSection.ItemContent>
            <Show when={index === 0}>
              <Badge variant="secondary">Mejor arma</Badge>
            </Show>
          </EditableSection.Item>
        )}
      </EditableSection.List>
    </EditableSection.Content>
  )
}
