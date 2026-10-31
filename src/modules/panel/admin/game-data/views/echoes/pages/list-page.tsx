import { Spinner } from "@/components/ui/spinner"
import { Suspense } from "react"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { dockActions } from "@/modules/panel/admin/game-data/views/echoes/constants/dock-actions"
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

      <Suspense fallback={<Spinner />}>
        <EchoList />
      </Suspense>

      <CatalogSection.DockActions items={dockActions} />
    </CatalogSection.Root>
  )
}
