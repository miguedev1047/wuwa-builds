import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { ResonatorForm } from "@catalog/presentation/resonators/shared/components/resonator-form"

export function ResonatorNew() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Nuevo resonador</CatalogSection.Title>
      </CatalogSection.Header>

      <ResonatorForm />
    </CatalogSection.Root>
  )
}
