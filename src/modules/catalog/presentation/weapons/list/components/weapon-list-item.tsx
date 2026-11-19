import { Tooltip } from "@/components/panelui/tooltip"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { WeaponItem } from "@catalog/presentation/components/entity-item"
import type { WeaponRow } from "@db/schema"

type WeaponListItemProps = {
  weapon: WeaponRow
}

/** Grid cell of the weapon catalog: link, tooltip and shared item. */
export function WeaponListItem({ weapon }: WeaponListItemProps) {
  const { DetailLink } = useCatalogActions()

  return (
    <CatalogSection.Item aspect="square" className="rounded-lg bg-muted/40">
      <Tooltip>
        <Tooltip.Trigger
          render={
            <DetailLink id={weapon.id}>
              <span className="block size-full">
                <WeaponItem weapon={weapon} />
              </span>
            </DetailLink>
          }
        />
        <Tooltip.Content>{weapon.name}</Tooltip.Content>
      </Tooltip>
    </CatalogSection.Item>
  )
}
