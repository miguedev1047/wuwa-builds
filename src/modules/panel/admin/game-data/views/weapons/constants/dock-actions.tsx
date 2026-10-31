import type { DockItemData } from "@/components/ui/dock"
import { Home02Icon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { linkOptions } from "@tanstack/react-router"

const glyph = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size="1em" strokeWidth={1.8} />
)

export const dockActions: DockItemData[] = [
  {
    type: "link",
    linkOptions: linkOptions({ to: "/admin" }),
    icon: glyph(Home02Icon),
    label: "Inicio",
  },
  {
    type: "link",
    linkOptions: linkOptions({ to: "/admin/weapons" }),
    icon: glyph(PlusIcon),
    label: "Agregar arma",
  },
]
