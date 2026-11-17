import { Dock, type DockItemData } from "@/components/ui/dock"

type ActionDockProps = {
  /** Actions and links to show in the shared dock. */
  items: DockItemData[]
  /** Accessible label for the navigation region. */
  ariaLabel?: string
}

/** Shared floating action bar for catalog and build screens. */
export function ActionDock({
  items,
  ariaLabel = "Acciones principales",
}: ActionDockProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className="h-[calc(96px+env(safe-area-inset-bottom))] shrink-0"
      />
      <nav aria-label={ariaLabel} className="fixed inset-x-0 bottom-6 z-40 h-0">
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
