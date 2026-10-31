import { create } from "zustand"

type DialogActionType = "edit" | "delete" | "none"

interface ResonatorDialogState {
  isOpen: boolean
  type: DialogActionType
  setIsOpen: (value: boolean) => void
  setType: (type: DialogActionType) => void
  open: () => void
  close: () => void
  toggle: () => void
}

/**
 * Open state of the resonator edit dialog.
 *
 * Zustand actions must call `set`; returning an object from them does nothing.
 */
export const useResonatorDialog = create<ResonatorDialogState>((set) => ({
  isOpen: false,
  type: "none",
  setIsOpen: (value) => set({ isOpen: value }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, type: "none" }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setType: (type) => set({ type }),
}))
