import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  SidebarPanel,
  SidebarAppHeader,
  SidebarEditorInspector,
} from "@build/presentation/editor/components/sidebar"

interface SidebarContainerProps {
  children: React.ReactNode
}

export function SidebarContainer({ children }: SidebarContainerProps) {
  return (
    <SidebarProvider>
      <SidebarPanel variant="inset" />
      <SidebarInset>
        <SidebarAppHeader />
        <div className="flex h-build-editor w-full flex-col gap-6 p-3 md:p-6 xl:overflow-hidden">
          {children}
        </div>
      </SidebarInset>
      <SidebarEditorInspector />
    </SidebarProvider>
  )
}
