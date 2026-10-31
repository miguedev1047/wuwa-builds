import type { DockItemData } from "@/components/ui/dock"
import {
  ChevronLeft,
  DeleteIcon,
  Home02Icon,
  PencilEdit01Icon,
  PlusIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { useResonatorDialog } from "../stores/dialog"

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

export const resonatorIdPageDockActions: DockItemData[] = [
  {
    type: "link",
    linkOptions: { to: "/admin/resonators" },
    icon: glyph(ChevronLeft),
    label: "Volver",
  },
  {
    type: "button",
    onClick: () => {
      useResonatorDialog.getState().open()
      useResonatorDialog.getState().setType("edit")
    },
    icon: glyph(PencilEdit01Icon),
    label: "Editar",
  },
  {
    type: "button",
    icon: glyph(DeleteIcon),
    onClick: () => {
      useResonatorDialog.getState().open()
      useResonatorDialog.getState().setType("delete")
    },
    label: "Eliminar",
  },
]
