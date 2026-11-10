import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { EchoList } from "@panel/admin/game-data/views/echoes/list/components/echo-list"
import { echoListDockActions } from "@panel/admin/game-data/views/echoes/list/dock-actions"
import { SkeletonSuspense } from "skullet/react"

export function EchoListPage() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Ecos</CatalogSection.Title>
        <CatalogSection.Description>
          Lista de ecos creados
        </CatalogSection.Description>
      </CatalogSection.Header>

      <SkeletonSuspense
        skeleton={
          <CatalogSection.Loading cols={6} aspect="square" count={12} />
        }
      >
        <EchoList />
      </SkeletonSuspense>

      <CatalogSection.DockActions items={echoListDockActions} />
    </CatalogSection.Root>
  )
}
