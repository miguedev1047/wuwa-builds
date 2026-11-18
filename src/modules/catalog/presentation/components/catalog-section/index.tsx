import {
  CatalogSectionRoot,
  CatalogSectionHeader,
  CatalogSectionTitle,
  CatalogSectionDescription,
  CatalogSectionAction,
  CatalogSectionContent,
} from "@catalog/presentation/components/catalog-section/components/catalog-section-shell"
export {
  CatalogSectionRoot,
  CatalogSectionHeader,
  CatalogSectionTitle,
  CatalogSectionDescription,
  CatalogSectionAction,
  CatalogSectionContent,
} from "@catalog/presentation/components/catalog-section/components/catalog-section-shell"
import {
  CatalogSectionItem,
  CatalogSectionImage,
} from "@catalog/presentation/components/catalog-section/components/catalog-section-item"
export {
  CatalogSectionItem,
  CatalogSectionImage,
} from "@catalog/presentation/components/catalog-section/components/catalog-section-item"
import { CatalogSectionEmpty } from "@catalog/presentation/components/catalog-section/components/catalog-section-empty"
export { CatalogSectionEmpty } from "@catalog/presentation/components/catalog-section/components/catalog-section-empty"
export const CatalogSection = {
  Root: CatalogSectionRoot,
  Header: CatalogSectionHeader,
  Title: CatalogSectionTitle,
  Description: CatalogSectionDescription,
  Action: CatalogSectionAction,
  Content: CatalogSectionContent,
  Item: CatalogSectionItem,
  Image: CatalogSectionImage,
  Empty: CatalogSectionEmpty,
} as const
