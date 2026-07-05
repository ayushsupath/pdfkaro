import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../../store/useStore'

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useThemeStore()

  return (
    <button
      onClick={toggleDarkMode}
      className="rounded-md border-2 border-black bg-ink p-3 text-ui transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-sm"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
