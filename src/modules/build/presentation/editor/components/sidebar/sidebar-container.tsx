import type { DockLinkItem } from "@/components/ui/dock"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"
import { BuildEditorDock } from "@build/presentation/editor/components/sidebar/build-editor-dock"
import { SidebarAppHeader } from "@build/presentation/editor/components/sidebar/sidebar-header"
import { SidebarEditorInspector } from "@build/presentation/editor/components/sidebar/sidebar-editor-inspector"

interface SidebarContainerProps {
  /** Workspace content rendered beside the inspector. */
  children: React.ReactNode
  /** Route-owned back link rendered as a Dock action. */
  backLink: DockLinkItem
  /** Name displayed in the workspace header. */
  buildName: string
  /** Saves a name edit to the current build. */
  onRename: (name: string) => void
  /** Whether the current build can be exported. */
  canDownload: boolean
  /** Whether an export is currently running. */
  isDownloading: boolean
  /** Starts exporting the current build. */
  onDownload: () => void
  /** Deletes the current build after confirmation. */
  onDelete: () => void
}

/** Composes the editor header, workspace, shared Dock and responsive inspector. */
export function SidebarContainer({
  children,
  backLink,
  buildName,
  onRename,
  canDownload,
  isDownloading,
  onDownload,
  onDelete,
}: SidebarContainerProps) {
  const isMobile = useIsMobile()
  const [inspectorExpanded, setInspectorExpanded] = useState(true)
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false)
  const inspectorOpen = isMobile ? mobileInspectorOpen : inspectorExpanded

  const handleToggleInspector = () => {
    if (isMobile) setMobileInspectorOpen((open) => !open)
    else setInspectorExpanded((expanded) => !expanded)
  }

  const handleSectionSelect = () => {
    if (isMobile) setMobileInspectorOpen(true)
  }

  return (
    <div className="flex h-svh w-full bg-background">
      <main className="flex h-full min-w-0 flex-1 flex-col">
        <SidebarAppHeader
          buildName={buildName}
          isMobile={isMobile}
          inspectorOpen={inspectorOpen}
          onRename={onRename}
          onToggleInspector={handleToggleInspector}
        />
        <div className="relative flex h-full w-full flex-col gap-6 overflow-hidden p-3 md:p-6">
          {children}
          <BuildEditorDock
            backLink={backLink}
            canDownload={canDownload}
            isDownloading={isDownloading}
            onDownload={onDownload}
            onDelete={onDelete}
            onSectionSelect={handleSectionSelect}
          />
        </div>
      </main>
      <SidebarEditorInspector
        isMobile={isMobile}
        open={inspectorOpen}
        onOpenChange={setMobileInspectorOpen}
      />
    </div>
  )
}
