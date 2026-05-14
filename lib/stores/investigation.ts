import { create } from 'zustand'

interface InvestigationStore {
  notes:    Record<string, string>
  setNotes: (id: string, notes: string) => void
  getNotes: (id: string, fallback?: string) => string
}

export const useInvestigationStore = create<InvestigationStore>((set, get) => ({
  notes:    {},
  setNotes: (id, notes) => set(s => ({ notes: { ...s.notes, [id]: notes } })),
  getNotes: (id, fallback = '') => get().notes[id] ?? fallback,
}))
