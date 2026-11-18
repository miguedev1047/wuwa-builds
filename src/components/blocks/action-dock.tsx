import { Dock, type DockItemData } from "@/components/ui/dock"
import { cn } from "cn"

/** Positioning contract of the shared dock container. */
export type ActionDockMode = "fixed" | "absolute"

type ActionDockProps = {
  /** Actions and links to show in the shared dock. */
  items: DockItemData[]
  /** Accessible label for the navigation region. */
  ariaLabel?: string
  /**
   * `fixed` pins the dock to the viewport. `absolute` anchors it to the
   * nearest positioned ancestor, which the editor's sidebar provides.
   */
  mode?: ActionDockMode
}

/** Shared floating action bar for catalog and build screens. */
export function ActionDock({
  items,
  ariaLabel = "Acciones principales",
  mode = "fixed",
}: ActionDockProps) {
  return (
    <>
      <div aria-hidden="true" className="h-action-dock-clearance shrink-0" />
      <nav
        aria-label={ariaLabel}
        className={cn(
          "inset-x-0 bottom-6 z-40 h-0",
          mode === "fixed" ? "fixed" : "absolute"
        )}
      >
        <Dock
          items={items}
          className="bottom-action-dock-offset!"
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
