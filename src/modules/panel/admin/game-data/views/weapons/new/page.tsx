import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { WeaponForm } from "@/modules/panel/admin/game-data/views/weapons/new/components/weapon-form"
import { weaponNewDockActions } from "@/modules/panel/admin/game-data/views/weapons/new/dock-actions"

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
