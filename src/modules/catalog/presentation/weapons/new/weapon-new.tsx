import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { WeaponForm } from "@catalog/presentation/weapons/shared/components/weapon-form"

export function WeaponNew() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Nueva arma</CatalogSection.Title>
        <CatalogSection.Description>
          Crea un arma en el catálogo o préllenala desde Encore
        </CatalogSection.Description>
      </CatalogSection.Header>

      <WeaponForm />
    </CatalogSection.Root>
  )
}
