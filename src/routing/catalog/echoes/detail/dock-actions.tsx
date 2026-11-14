import type { DockItemData } from "@/components/ui/dock"
import { ChevronLeft } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

const glyph = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} strokeWidth={1.8} />
)

export const echoDetailDockActions: DockItemData[] = [
  {
    type: "link",
    linkOptions: { to: "/admin/echoes" },
    icon: glyph(ChevronLeft),
    label: "Volver",
  },
]
