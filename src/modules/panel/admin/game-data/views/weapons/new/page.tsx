import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { WeaponForm } from "@panel/admin/game-data/views/weapons/shared/components/weapon-form"
import { weaponNewDockActions } from "@panel/admin/game-data/views/weapons/new/dock-actions"

export function WeaponNewPage() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Nueva arma</CatalogSection.Title>
        <CatalogSection.Description>
          Crea un arma en el catálogo o préllenala desde Encore
        </CatalogSection.Description>
      </CatalogSection.Header>

      <WeaponForm />

      <CatalogSection.DockActions items={weaponNewDockActions} />
    </CatalogSection.Root>
  )
}
