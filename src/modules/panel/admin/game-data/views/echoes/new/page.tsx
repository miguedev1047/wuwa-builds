import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { EchoForm } from "@panel/admin/game-data/views/echoes/shared/components/echo-form"
import { echoNewDockActions } from "@panel/admin/game-data/views/echoes/new/dock-actions"

export function EchoNewPage() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Nuevo eco</CatalogSection.Title>
        <CatalogSection.Description>
          Crea un eco en el catálogo o préllenalo desde Encore
        </CatalogSection.Description>
      </CatalogSection.Header>

      <EchoForm />

      <CatalogSection.DockActions items={echoNewDockActions} />
    </CatalogSection.Root>
  )
}
