import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ChevronLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"

export function SidebarAppFooter() {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuButton
          render={
            <Link to="/panel/my-builds">
              <HugeiconsIcon icon={ChevronLeftIcon} />
              Volver
            </Link>
          }
        />
      </SidebarMenu>
    </SidebarFooter>
  )
}
