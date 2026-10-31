import { Show } from "@/components/utility/show"
import type { EchoRow } from "@/db/schema"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"

export function EchoItem({ echo }: { echo: EchoRow }) {
  return (
    <CatalogSection.Item className="aspect-square rounded-lg bg-muted/40">
      <Show when={echo.icon}>
        {(image) => (
          <CatalogSection.Image animated alt={echo.name} src={image} />
        )}
      </Show>
    </CatalogSection.Item>
  )
}
