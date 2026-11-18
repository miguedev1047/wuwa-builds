import { RouteNavigation } from "@/components/blocks/route-navigation"
import { FlowingMenu, type FlowingMenuItem } from "@/components/ui/flowing-menu"
import { linkOptions } from "@tanstack/react-router"

const items: FlowingMenuItem[] = [
  {
    type: "link",
    linkOptions: linkOptions({ to: "/admin/resonators" }),
    text: "Resonadores",
    image:
      "https://wuwatracker.com/_next/image?url=%2Fapi%2Fcharacter-portraits%2Ffile%2Fcartethyia.webp&w=640&q=75",
  },
  {
    type: "link",
    linkOptions: linkOptions({ to: "/admin/weapons" }),
    text: "Armas",
    image:
      "https://wuwatracker.com/_next/image?url=%2Fapi%2Fweapon-icons%2Ffile%2Fdefiers-thorn.webp&w=256&q=30",
  },
  {
    type: "link",
    linkOptions: linkOptions({ to: "/admin/echoes" }),
    text: "Ecos",
    image:
      "https://api-v2.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconMonsterHead/T_IconMonsterHead_34025_0_UI.webp",
  },
]

/**
 * Admin landing: one row per catalog section. The height token accounts for the
 * app shell and the top margin keeps the gap under the sticky navigation.
 */
export function AdminMenuPage() {
  return (
    <RouteNavigation.Root
      variant="extended"
      aria-label="Administración del catálogo"
      className="mt-10 h-admin-menu py-0"
    >
      <RouteNavigation.Content className="h-full">
        <FlowingMenu
          items={items}
          speed={60}
          stretch={0.6}
          magnet={0.25}
          followCursor={0.4}
          textColor="var(--card-foreground)"
          bgColor="var(--background)"
          marqueeBgColor="var(--foreground)"
          marqueeTextColor="var(--background)"
          direction="right"
          duration={0.5}
          bandInset={0}
          bandRadius={0}
          carryContent={false}
          dividers
          dimInactive={false}
          align="center"
          showIndex={false}
          showArrow
          imageShape="circle"
          intro
        />
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}
