import type { DockItemData } from "@/components/ui/dock"
import { ChevronLeft, Home02Icon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

const glyph = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size="1em" strokeWidth={1.8} />
)

export const resonatorPageDockActions: DockItemData[] = [
  {
    type: "link",
    linkOptions: { to: "/admin" },
    icon: glyph(Home02Icon),
    label: "Inicio",
  },
  {
    type: "link",
    linkOptions: { to: "/admin/resonators/new" },
    icon: glyph(PlusIcon),
    label: "Agregar resonador",
  },
]

export const resonatorNewPageDockActions: DockItemData[] = [
  {
    type: "link",
    linkOptions: { to: "/admin/resonators" },
    icon: glyph(ChevronLeft),
    label: "Volver",
  },
]
