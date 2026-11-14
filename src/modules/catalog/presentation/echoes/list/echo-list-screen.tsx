import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { EchoList } from "@catalog/presentation/echoes/list/components/echo-list"
import { Suspense } from "react"

export function EchoListScreen() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Ecos</CatalogSection.Title>
        <CatalogSection.Description>
          Lista de ecos creados
        </CatalogSection.Description>
      </CatalogSection.Header>

      <Suspense
        fallback={
          <CatalogSection.Loading cols={6} aspect="square" count={12} />
        }
      >
        <EchoList />
      </Suspense>
    </CatalogSection.Root>
  )
}
