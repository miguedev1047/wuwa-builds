import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { ResonatorList } from "@/modules/panel/admin/game-data/views/resonators/components/resonator-list"
import { resonatorPageDockActions } from "@/modules/panel/admin/game-data/views/resonators/helpers/dock-actions"

export function ResonatorListPage() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Resonadores</CatalogSection.Title>
        <CatalogSection.Description>
          Lista de resonadores creados
        </CatalogSection.Description>
      </CatalogSection.Header>

      <CatalogSection.Content>
        <ResonatorList />
      </CatalogSection.Content>

      <CatalogSection.DockActions items={resonatorPageDockActions} />
    </CatalogSection.Root>
  )
}
