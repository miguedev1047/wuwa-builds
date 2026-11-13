import { Suspense } from "react"
import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { WeaponList } from "@panel/admin/game-data/views/weapons/list/components/weapon-list"
import { weaponListDockActions } from "@panel/admin/game-data/views/weapons/list/dock-actions"

export function WeaponListPage() {
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

      <CatalogSection.DockActions items={weaponListDockActions} />
    </CatalogSection.Root>
  )
}
