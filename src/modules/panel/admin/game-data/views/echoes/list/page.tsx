import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { EchoList } from "@/modules/panel/admin/game-data/views/echoes/list/components/echo-list"
import { echoListDockActions } from "@/modules/panel/admin/game-data/views/echoes/list/dock-actions"

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

      <CatalogSection.DockActions items={echoListDockActions} />
    </CatalogSection.Root>
  )
}
