import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ChevronLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactElement } from "react"

interface SidebarAppFooterProps {
  backLink: ReactElement
}

export function SidebarAppFooter({ backLink }: SidebarAppFooterProps) {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuButton render={backLink}>
          <HugeiconsIcon icon={ChevronLeftIcon} />
          Volver
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarFooter>
  )
}
