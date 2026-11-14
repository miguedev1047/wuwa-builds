import { Suspense } from "react"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { WeaponList } from "@catalog/presentation/weapons/list/components/weapon-list"

export function WeaponListScreen() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Armas</CatalogSection.Title>
        <CatalogSection.Description>
          Lista de armas creadas
        </CatalogSection.Description>
      </CatalogSection.Header>

      <Suspense
        fallback={
          <CatalogSection.Loading
            cols={6}
            aspect="square"
            count={12}
            label="Cargando armas"
          />
        }
      >
        <WeaponList />
      </Suspense>
    </CatalogSection.Root>
  )
}
