import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Show } from "@/components/utility/show"
import type { EchoRow } from "@db/schema"
import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { Link } from "@tanstack/react-router"

export function EchoItem({ echo }: { echo: EchoRow }) {
  const echoId = echo.id.toString()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link to="/admin/echoes/$id" params={{ id: echoId }}>
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
          </Link>
        }
      />
      <TooltipContent>{echo.name}</TooltipContent>
    </Tooltip>
  )
}
