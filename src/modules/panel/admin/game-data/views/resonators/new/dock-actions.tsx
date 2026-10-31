import type { DockItemData } from "@/components/ui/dock"
import { ChevronLeft } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

const glyph = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size="1em" strokeWidth={1.8} />
)

export const resonatorNewDockActions: DockItemData[] = [
  {
    type: "link",
    linkOptions: { to: "/admin/resonators" },
    icon: glyph(ChevronLeft),
    label: "Volver",
  },
]
