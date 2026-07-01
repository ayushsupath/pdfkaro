import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () =>
        set((state) => {
          const next = !state.darkMode
          document.documentElement.classList.toggle('dark', next)
          return { darkMode: next }
        }),
      initTheme: () => {
        const stored = useThemeStore.getState().darkMode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const darkMode = stored ?? prefersDark
        document.documentElement.classList.toggle('dark', darkMode)
        set({ darkMode })
      },
    }),
    { name: 'pdfkaro-theme' }
  )
)

export const useSignatureStore = create(
  persist(
    (set) => ({
      savedSignature: null,
      savedInitials: null,
      setSavedSignature: (data) => set({ savedSignature: data }),
      setSavedInitials: (data) => set({ savedInitials: data }),
      clearSavedSignature: () => set({ savedSignature: null }),
    }),
    { name: 'pdfkaro-signature' }
  )
)
