import { Suspense } from "react"
import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { ResonatorList } from "@panel/admin/game-data/views/resonators/list/components/resonator-list"
import { resonatorListDockActions } from "@panel/admin/game-data/views/resonators/list/dock-actions"

export function ResonatorListPage() {
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

      <CatalogSection.DockActions items={resonatorListDockActions} />
    </CatalogSection.Root>
  )
}
