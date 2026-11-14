import { Dock, type DockItemData } from "@/components/ui/dock"
interface CatalogSectionDockProps {
  items: DockItemData[]
}

/**
 * Floating action bar for the catalog screens: it is the main action surface,
 * so pages no longer render header buttons. `CatalogSection.Action` stays
 * available for screens that need inline actions (detail pages, forms).
 *
 * The bar is fixed to the viewport bottom, respects the iOS safe area and
 * reserves its own height so the grid never ends underneath it.
 */
export function CatalogSectionDockActions({ items }: CatalogSectionDockProps) {
  return (
    <>
      <nav
        aria-label="Acciones del catalogo"
        className="fixed inset-x-0 bottom-6 z-40 h-0"
      >
        <Dock
          items={items}
          className="bottom-[max(12px,env(safe-area-inset-bottom))]!"
          baseItemSize={44}
          magnification={58}
          panelHeight={60}
          gap={8}
          bounce={false}
          showLabels
          showIndicators
          showBadges={false}
        />
      </nav>
    </>
  )
}
