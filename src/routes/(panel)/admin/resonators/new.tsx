import { CatalogSectionDockActions } from "@/routing/catalog/catalog-dock"
import { resonatorNewDockActions } from "@/routing/catalog/resonators/new/dock-actions"
import { CatalogNavigation } from "@/routing/catalog/catalog-navigation"
import { ResonatorNew } from "@catalog/presentation/resonators/new/resonator-new"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/resonators/new")({
  component: () => (
    <CatalogNavigation entity="resonators">
      <ResonatorNew />
      <CatalogSectionDockActions items={resonatorNewDockActions} />
    </CatalogNavigation>
  ),
})
