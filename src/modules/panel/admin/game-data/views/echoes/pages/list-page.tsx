import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { dockActions } from "@/modules/panel/admin/game-data/views/echoes/helpers/dock-actions"
import { EchoList } from "@/modules/panel/admin/game-data/views/echoes/components/echo-list"

export function EchoListPage() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Ecos</CatalogSection.Title>
        <CatalogSection.Description>
          Lista de ecos creados
        </CatalogSection.Description>
      </CatalogSection.Header>

      <EchoList />

      <CatalogSection.DockActions items={dockActions} />
    </CatalogSection.Root>
  )
}
