import { Tooltip } from "@/components/panelui/tooltip"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { ResonatorItem } from "@catalog/presentation/components/entity-item"
import type { ResonatorRow } from "@db/schema"

type ResonatorListItemProps = {
  character: ResonatorRow
}

/** Grid cell of the resonator catalog: link, tooltip and shared item. */
export function ResonatorListItem({ character }: ResonatorListItemProps) {
  const { DetailLink } = useCatalogActions()

  return (
    <CatalogSection.Item aspect="portrait" className="rounded-lg">
      <Tooltip>
        <Tooltip.Trigger
          render={
            <DetailLink id={character.id}>
              <span className="block size-full">
                <ResonatorItem character={character} />
              </span>
            </DetailLink>
          }
        />
        <Tooltip.Content>{character.name}</Tooltip.Content>
      </Tooltip>
    </CatalogSection.Item>
  )
}
