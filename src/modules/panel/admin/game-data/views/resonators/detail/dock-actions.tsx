import type { DockItemData } from "@/components/ui/dock"
import {
  ChevronLeft,
  DeleteIcon,
  PencilEdit01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

const glyph = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size="1em" strokeWidth={1.8} />
)

type DetailDockHandlers = {
  onEdit: () => void
  onDelete: () => void
}

/**
 * Actions of the resonator detail page.
 *
 * It is a factory instead of a constant so the page can pass its own handlers:
 * the dialogs live in the page, so there is no need for a global store.
 */
export const resonatorDetailDockActions = ({
  onEdit,
  onDelete,
}: DetailDockHandlers): DockItemData[] => [
  {
    type: "link",
    linkOptions: { to: "/admin/resonators" },
    icon: glyph(ChevronLeft),
    label: "Volver",
  },
  {
    type: "button",
    onClick: onEdit,
    icon: glyph(PencilEdit01Icon),
    label: "Editar",
  },
  {
    type: "button",
    onClick: onDelete,
    icon: glyph(DeleteIcon),
    label: "Eliminar",
  },
]
