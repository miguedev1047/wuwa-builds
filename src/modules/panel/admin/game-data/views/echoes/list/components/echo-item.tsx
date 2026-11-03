import { Show } from "@/components/utility/show"
import type { EchoRow } from "@/db/schema"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { Link } from "@tanstack/react-router"

export function EchoItem({ echo }: { echo: EchoRow }) {
  const echoId = echo.id.toString()

  return (
    <Link to="/admin/echoes/$id" params={{ id: echoId }}>
      <CatalogSection.Item aspect="square" className="rounded-lg bg-muted/40">
        <Show when={echo.icon}>
          {(image) => (
            <CatalogSection.Image
              animated
              alt={echo.name}
              className="object-contain"
              src={image}
            />
          )}
        </Show>
      </CatalogSection.Item>
    </Link>
  )
}
