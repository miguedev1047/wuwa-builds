import { ActionDock } from "@/components/blocks/action-dock"
import { weaponNewDockActions } from "@/routing/catalog/weapons/new/dock-actions"
import { CatalogNavigation } from "@/routing/catalog/catalog-navigation"
import { WeaponNew } from "@catalog/presentation/weapons/new/weapon-new"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/weapons/new")({
  component: () => (
    <CatalogNavigation entity="weapons">
      <WeaponNew />
      <ActionDock items={weaponNewDockActions} />
    </CatalogNavigation>
  ),
})
