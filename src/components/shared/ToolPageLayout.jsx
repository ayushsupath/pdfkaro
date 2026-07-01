import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ToolPageLayout({ title, description, children }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
      >
        <ArrowLeft className="h-4 w-4" />
        All tools
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
          🔒 Processed locally — files never leave your device
        </p>
      </div>

      <div className="space-y-6">{children}</div>
    </div>
  )
}
