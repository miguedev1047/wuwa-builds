import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { resonatorIdPageDockActions } from "@/modules/panel/admin/game-data/views/resonators/helpers/dock-actions"
import { ResonatorInfoSection } from "@/modules/panel/admin/game-data/views/resonators/sections/resonator-info-section"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { Show } from "@/components/utility/show"

export function ResonatorIdPage() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  const { isPending } = useQuery({
    ...characterQueries.detail(resonatorId),
    enabled: Number.isInteger(resonatorId) && resonatorId > 0,
  })

  return (
    <>
      <ResonatorInfoSection />

      <Show when={!isPending}>
        <CatalogSection.DockActions items={resonatorIdPageDockActions} />
      </Show>
    </>
  )
}
