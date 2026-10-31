import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { dockActions } from "@/modules/panel/admin/game-data/views/weapons/helpers/dock-actions"
import { WeaponList } from "@/modules/panel/admin/game-data/views/weapons/components/weapon-list"

export function WeaponListPage() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Armas</CatalogSection.Title>
        <CatalogSection.Description>
          Lista de armas creadas
        </CatalogSection.Description>
      </CatalogSection.Header>

      <WeaponList />

      <CatalogSection.DockActions items={dockActions} />
    </CatalogSection.Root>
  )
}
