import { create } from 'zustand'

interface UiStore {
  commandPaletteOpen: boolean
  analystOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  toggleAnalyst: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  commandPaletteOpen: false,
  analystOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleAnalyst: () => set((s) => ({ analystOpen: !s.analystOpen })),
}))
