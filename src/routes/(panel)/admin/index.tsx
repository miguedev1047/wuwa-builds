import { FlowingMenu, type FlowingMenuItem } from "@/components/ui/flowing-menu"
import { createFileRoute, linkOptions } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/")({
  component: RouteComponent,
})

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

function RouteComponent() {
  return (
    <div className="h-admin-menu w-full">
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
    </div>
  )
}
