import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { SonataAddAction } from "@catalog/presentation/sonatas/components/sonata-add-action"
import { SonataList } from "@catalog/presentation/sonatas/components/sonata-list"
import { SonataSyncAction } from "@catalog/presentation/sonatas/components/sonata-sync-action"
import { Suspense } from "react"

export function SonataListScreen() {
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

      <Suspense
        fallback={
          <CatalogSection.Loading cols={4} aspect="portrait" count={4} />
        }
      >
        <SonataList />
      </Suspense>
    </CatalogSection.Root>
  )
}
