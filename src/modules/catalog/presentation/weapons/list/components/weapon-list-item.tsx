import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { WeaponItem } from "@catalog/presentation/components/entity-item"
import type { WeaponRow } from "@db/schema"

type WeaponListItemProps = {
  weapon: WeaponRow
}

/**
 * Grid cell of the weapon catalog: the shared item inside its detail link.
 *
 * The cell only owns the aspect ratio; the item owns the frame, background and
 * tooltip, so every list that renders it looks the same.
 */
export function WeaponListItem({ weapon }: WeaponListItemProps) {
  const { DetailLink } = useCatalogActions()

  return (
    <li className="aspect-square">
      <DetailLink id={weapon.id}>
        <div className="block size-full">
          <WeaponItem weapon={weapon} />
        </div>
      </DetailLink>
    </li>
  )
}
