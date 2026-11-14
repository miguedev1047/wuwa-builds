import type { DockItemData } from "@/components/ui/dock"
import { ChevronLeft } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

const glyph = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} strokeWidth={1.8} />
)

export const resonatorDetailDockActions: DockItemData[] = [
  {
    type: "link",
    linkOptions: { to: "/admin/resonators" },
    icon: glyph(ChevronLeft),
    label: "Volver",
  },
]
