import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { ResonatorItem } from "@catalog/presentation/components/entity-item"
import type { ResonatorRow } from "@db/schema"

type ResonatorListItemProps = {
  character: ResonatorRow
}

/**
 * Grid cell of the resonator catalog: the shared item inside its detail link.
 *
 * The cell only owns the aspect ratio; the item owns the frame, background and
 * tooltip, so every list that renders it looks the same.
 */
export function ResonatorListItem({ character }: ResonatorListItemProps) {
  const { DetailLink } = useCatalogActions()

  return (
    <li className="aspect-2/3">
      <DetailLink id={character.id}>
        <div className="block size-full">
          <ResonatorItem character={character} />
        </div>
      </DetailLink>
    </li>
  )
}
