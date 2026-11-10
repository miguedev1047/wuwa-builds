import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { ResonatorForm } from "@panel/admin/game-data/views/resonators/shared/components/resonator-form"
import { resonatorNewDockActions } from "@panel/admin/game-data/views/resonators/new/dock-actions"

export function ResonatorNewPage() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Nuevo resonador</CatalogSection.Title>
      </CatalogSection.Header>

      <ResonatorForm />

      <CatalogSection.DockActions items={resonatorNewDockActions} />
    </CatalogSection.Root>
  )
}
