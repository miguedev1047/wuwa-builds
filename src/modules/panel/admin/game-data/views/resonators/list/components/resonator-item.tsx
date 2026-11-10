import { Show } from "@/components/utility/show"
import type { ResonatorRow } from "@db/schema"
import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { Link } from "@tanstack/react-router"

export function ResonatorItem({ character }: { character: ResonatorRow }) {
  const resonatorId = character.id.toString()

  return (
    <Link to="/admin/resonators/$id" params={{ id: resonatorId }}>
      <CatalogSection.Item>
        <Show when={character.iconLarge}>
          {(icon) => <CatalogSection.Image animated src={icon} />}
        </Show>
      </CatalogSection.Item>
    </Link>
  )
}
