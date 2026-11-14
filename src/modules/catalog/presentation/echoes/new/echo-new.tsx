import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { EchoForm } from "@catalog/presentation/echoes/shared/components/echo-form"

export function EchoNew() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Nuevo eco</CatalogSection.Title>
        <CatalogSection.Description>
          Crea un eco en el catálogo o préllenalo desde Encore
        </CatalogSection.Description>
      </CatalogSection.Header>

      <EchoForm />
    </CatalogSection.Root>
  )
}
