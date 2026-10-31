import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { resonatorNewPageDockActions } from "@/modules/panel/admin/game-data/views/resonators/helpers/dock-actions"
import { ResonatorForm } from "@/modules/panel/admin/game-data/views/resonators/components/resonator-form"

export function ResonatorNewPage() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Nuevo resonador</CatalogSection.Title>
      </CatalogSection.Header>

      <ResonatorForm />

      <CatalogSection.DockActions items={resonatorNewPageDockActions} />
    </CatalogSection.Root>
  )
}
