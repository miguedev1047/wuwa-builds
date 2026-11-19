import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { EchoItem } from "@catalog/presentation/components/entity-item"
import type { EchoRow } from "@db/schema"

type EchoListItemProps = {
  echo: EchoRow
}

/**
 * Grid cell of the echo catalog: the shared item inside its detail link.
 *
 * The cell only owns the aspect ratio; the item owns the frame, background and
 * tooltip, so every list that renders it looks the same.
 */
export function EchoListItem({ echo }: EchoListItemProps) {
  const { DetailLink } = useCatalogActions()

  return (
    <li className="aspect-square">
      <DetailLink id={echo.id}>
        <div className="block size-full">
          <EchoItem echo={echo} />
        </div>
      </DetailLink>
    </li>
  )
}
