import { Suspense } from "react"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { ResonatorList } from "@catalog/presentation/resonators/list/components/resonator-list"

export function ResonatorListScreen() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Resonadores</CatalogSection.Title>
        <CatalogSection.Description>
          Lista de resonadores creados
        </CatalogSection.Description>
      </CatalogSection.Header>

      <CatalogSection.Content>
        <Suspense
          fallback={
            <CatalogSection.Loading
              cols={8}
              aspect="portrait"
              count={20}
              label="Cargando resonadores"
            />
          }
        >
          <ResonatorList />
        </Suspense>
      </CatalogSection.Content>
    </CatalogSection.Root>
  )
}
