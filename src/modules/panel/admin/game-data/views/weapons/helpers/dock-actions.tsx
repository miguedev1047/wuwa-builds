import type { DockItemData } from "@/components/ui/dock"
import { Home02Icon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

const glyph = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size="1em" strokeWidth={1.8} />
)

export const dockActions: DockItemData[] = [
  {
    type: "link",
    linkOptions: { to: "/admin" },
    icon: glyph(Home02Icon),
    label: "Inicio",
  },
  {
    type: "link",
    linkOptions: { to: "/admin/weapons" },
    icon: glyph(PlusIcon),
    label: "Agregar arma",
  },
]
