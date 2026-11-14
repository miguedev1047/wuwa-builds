import type { DockItemData } from "@/components/ui/dock"
import { GhostIcon, Home02Icon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

const glyph = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} strokeWidth={1.8} />
)

export const echoListDockActions: DockItemData[] = [
  {
    type: "link",
    linkOptions: { to: "/admin" },
    icon: glyph(Home02Icon),
    label: "Inicio",
  },
  {
    type: "link",
    linkOptions: { to: "/admin/echoes/new" },
    icon: glyph(PlusIcon),
    label: "Agregar eco",
  },
  {
    type: "link",
    linkOptions: { to: "/admin/echoes/sonatas" },
    icon: glyph(GhostIcon),
    label: "Efectos de sonata",
  },
]
