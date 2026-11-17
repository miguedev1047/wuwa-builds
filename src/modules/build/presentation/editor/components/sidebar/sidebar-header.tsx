import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/panelui/button"
import { BuildHeaderActions } from "@build/presentation/editor/components/sidebar/build-header-actions"
import { SidebarLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type SidebarAppHeaderProps = {
  /** Build name displayed and edited in the header. */
  buildName: string
  /** Whether the inspector should use mobile labels and behavior. */
  isMobile: boolean
  /** Whether the inspector is visible or open. */
  inspectorOpen: boolean
  /** Saves an edited name. */
  onRename: (name: string) => void
  /** Toggles the desktop panel or mobile Sheet. */
  onToggleInspector: () => void
}

/** Header for renaming the build and opening or collapsing its inspector. */
export function SidebarAppHeader({
  buildName,
  isMobile,
  inspectorOpen,
  onRename,
  onToggleInspector,
}: SidebarAppHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/20 px-4">
      <Button
        aria-label={
          isMobile
            ? inspectorOpen
              ? "Cerrar inspector"
              : "Abrir inspector"
            : inspectorOpen
              ? "Contraer inspector"
              : "Expandir inspector"
        }
        aria-expanded={inspectorOpen}
        variant="ghost"
        size="icon-sm"
        className="-ml-1"
        onClick={onToggleInspector}
      >
        <HugeiconsIcon icon={SidebarLeftIcon} />
      </Button>
      <Separator
        orientation="vertical"
        className="my-auto mr-2 data-[orientation=vertical]:h-4"
      />
      <BuildHeaderActions name={buildName} onRename={onRename} />
    </header>
  )
}
