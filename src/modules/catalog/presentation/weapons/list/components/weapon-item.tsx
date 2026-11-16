import { Tooltip } from "@/components/panelui/tooltip"
import { Show } from "@/components/utility/show"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import type { WeaponRow } from "@db/schema"

export function WeaponItem({ weapon }: { weapon: WeaponRow }) {
  const { DetailLink } = useCatalogActions()

  return (
    <Tooltip>
      <Tooltip.Trigger
        render={
          <DetailLink id={weapon.id}>
            <CatalogSection.Item
              aspect="square"
              className="rounded-lg bg-muted/40"
            >
              <Show when={weapon.icon}>
                {(image) => (
                  <CatalogSection.Image
                    alt={weapon.name}
                    src={image}
                    hover="zoom"
                    fit="cover"
                    className="size-full"
                    aspect="portrait"
                    background="accent"
                  />
                )}
              </Show>
            </CatalogSection.Item>
          </DetailLink>
        }
      />
      <Tooltip.Content>{weapon.name}</Tooltip.Content>
    </Tooltip>
  )
}
