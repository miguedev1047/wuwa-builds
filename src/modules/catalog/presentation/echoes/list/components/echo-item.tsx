import { Tooltip } from "@/components/panelui/tooltip"
import { Show } from "@/components/utility/show"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import type { EchoRow } from "@db/schema"

export function EchoItem({ echo }: { echo: EchoRow }) {
  const { DetailLink } = useCatalogActions()

  return (
    <Tooltip>
      <Tooltip.Trigger
        render={
          <DetailLink id={echo.id}>
            <CatalogSection.Item
              aspect="square"
              className="rounded-lg bg-muted/40"
            >
              <Show when={echo.icon}>
                {(image) => (
                  <CatalogSection.Image
                    alt={echo.name}
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
      <Tooltip.Content>{echo.name}</Tooltip.Content>
    </Tooltip>
  )
}
