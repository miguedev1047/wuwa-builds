import type { DockItemData } from "@/components/ui/dock"
import { Home02Icon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

const glyph = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} strokeWidth={1.8} />
)

export const weaponListDockActions: DockItemData[] = [
  {
    type: "link",
    linkOptions: { to: "/admin" },
    icon: glyph(Home02Icon),
    label: "Inicio",
  },
  {
    type: "link",
    linkOptions: { to: "/admin/weapons/new" },
    icon: glyph(PlusIcon),
    label: "Agregar arma",
  },
]
