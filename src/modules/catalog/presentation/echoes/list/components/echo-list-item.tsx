import { Tooltip } from "@/components/panelui/tooltip"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { EchoItem } from "@catalog/presentation/components/entity-item"
import type { EchoRow } from "@db/schema"

type EchoListItemProps = {
  echo: EchoRow
}

/** Grid cell of the echo catalog: link, tooltip and shared item. */
export function EchoListItem({ echo }: EchoListItemProps) {
  const { DetailLink } = useCatalogActions()

  return (
    <CatalogSection.Item aspect="square" className="rounded-lg bg-muted/40">
      <Tooltip>
        <Tooltip.Trigger
          render={
            <DetailLink id={echo.id}>
              <span className="block size-full">
                <EchoItem echo={echo} />
              </span>
            </DetailLink>
          }
        />
        <Tooltip.Content>{echo.name}</Tooltip.Content>
      </Tooltip>
    </CatalogSection.Item>
  )
}
