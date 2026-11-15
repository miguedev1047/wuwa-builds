import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BuildHeaderActions } from "@build/presentation/editor/components/sidebar"

type SidebarAppHeaderProps = {
  canDownload: boolean
  isDownloading: boolean
  onDownload: () => void
  onDelete: () => void
}

export function SidebarAppHeader(props: SidebarAppHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="my-auto mr-2 data-[orientation=vertical]:h-4"
      />
      <BuildHeaderActions {...props} />
    </header>
  )
}
