import { Show } from "@/components/utility/show"
import type { ResonatorRow } from "@/db/schema"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"

export function ResonatorItem({ character }: { character: ResonatorRow }) {
  return (
    <CatalogSection.Item>
      <Show when={character.iconLarge}>
        {(image) => <CatalogSection.Image animated src={image} />}
      </Show>
    </CatalogSection.Item>
  )
}
