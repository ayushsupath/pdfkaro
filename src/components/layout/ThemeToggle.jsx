import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../../store/useStore'

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useThemeStore()

  return (
    <button
      onClick={toggleDarkMode}
      className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
