// src/stores/languageStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageStore {
  isHindi: boolean
  toggleLanguage: () => void
  t: (en: string, hi: string) => string
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      isHindi: false,
      toggleLanguage: () => set((state) => ({ isHindi: !state.isHindi })),
      t: (en: string, hi: string) => (get().isHindi ? hi : en),
    }),
    { name: 'fastkaam-lang' }
  )
)
