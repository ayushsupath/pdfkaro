import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../../store/useStore'

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useThemeStore()

  return (
    <button
      onClick={toggleDarkMode}
      className="border border-border bg-black/80 p-2 text-primary transition-colors hover:bg-primary hover:text-background"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
