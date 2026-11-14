import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Show } from "@/components/utility/show"
import type { EchoRow } from "@db/schema"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"

export function EchoItem({ echo }: { echo: EchoRow }) {
  const { DetailLink } = useCatalogActions()

  return (
    <Tooltip>
      <TooltipTrigger
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
      <TooltipContent>{echo.name}</TooltipContent>
    </Tooltip>
  )
}
