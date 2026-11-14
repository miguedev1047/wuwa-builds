import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useBuildCollection } from "@/modules/build/client/hooks/build-live-queries"
import { useBuildIdentity } from "../../build-identity"
import type { BuildEditorSection } from "@/modules/build/domain/build-record"
import { updateBuild } from "@/modules/build/client/build-store"
import {
  ColorsIcon,
  LayerIcon,
  SwordIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { SidebarAppFooter } from "./sidebar-footer"

export const SECTIONS = [
  {
    title: "Resonador",
    id: "resonator",
    icon: UserIcon,
  },
  {
    title: "Arma",
    id: "weapon",
    icon: SwordIcon,
  },
  {
    title: "Ecos",
    id: "echo",
    icon: LayerIcon,
  },
  {
    title: "Apariencia",
    id: "appareance",
    icon: ColorsIcon,
  },
] as const

export function SidebarPanel({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { buildId, sessionId } = useBuildIdentity()
  const { data: build } = useBuildCollection({ buildId, sessionId })

  const currentSection = build?.selectedEditorSection

  const handleSelectSection = (section: BuildEditorSection) => {
    updateBuild({ buildId, sessionId }, (current) => {
      current.selectedEditorSection = section
    })
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>Editor</SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {SECTIONS.map((section) => (
            <SidebarMenuItem key={section.id}>
              <SidebarMenuButton
                isActive={section.id === currentSection}
                onClick={() => handleSelectSection(section.id)}
              >
                <HugeiconsIcon icon={section.icon} />
                {section.title}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarAppFooter />
      <SidebarRail />
    </Sidebar>
  )
}
