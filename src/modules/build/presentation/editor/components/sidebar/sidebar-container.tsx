import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  SidebarPanel,
  SidebarAppHeader,
  SidebarEditorInspector,
} from "@build/presentation/editor/components/sidebar"

interface SidebarContainerProps {
  children: React.ReactNode
  canDownload: boolean
  isDownloading: boolean
  onDownload: () => void
  onDelete: () => void
}

export function SidebarContainer({
  children,
  canDownload,
  isDownloading,
  onDownload,
  onDelete,
}: SidebarContainerProps) {
  return (
    <SidebarProvider>
      <SidebarPanel variant="inset" />
      <SidebarInset>
        <SidebarAppHeader
          canDownload={canDownload}
          isDownloading={isDownloading}
          onDownload={onDownload}
          onDelete={onDelete}
        />
        <div className="flex h-build-editor w-full flex-col gap-6 p-3 md:p-6 xl:overflow-hidden">
          {children}
        </div>
      </SidebarInset>
      <SidebarEditorInspector />
    </SidebarProvider>
  )
}
