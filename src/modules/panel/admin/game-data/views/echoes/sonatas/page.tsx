import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { SonataAddAction } from "@/modules/panel/admin/game-data/views/echoes/sonatas/components/sonata-add-action"
import { SonataList } from "@/modules/panel/admin/game-data/views/echoes/sonatas/components/sonata-list"
import { SonataSyncAction } from "@/modules/panel/admin/game-data/views/echoes/sonatas/components/sonata-sync-action"
import { sonataDockActions } from "@/modules/panel/admin/game-data/views/echoes/sonatas/dock-actions"
import { SkeletonSuspense } from "skullet/react"

export function SonataListPage() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Efectos de sonata</CatalogSection.Title>
        <CatalogSection.Description>
          Sets de eco y sus bonos por cantidad de piezas
        </CatalogSection.Description>

        <CatalogSection.Action>
          <SonataSyncAction />
          <SonataAddAction />
        </CatalogSection.Action>
      </CatalogSection.Header>

      <SkeletonSuspense
        skeleton={
          <CatalogSection.Loading cols={4} aspect="portrait" count={4} />
        }
      >
        <SonataList />
      </SkeletonSuspense>

      <CatalogSection.DockActions items={sonataDockActions} />
    </CatalogSection.Root>
  )
}
