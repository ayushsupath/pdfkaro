import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react'

export default function ToolCard({ tool }) {
  const Icon = Icons[tool.icon] || Icons.FileText

  return (
    <Link
      to={tool.path}
      className={`group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 ${
        tool.featured ? 'ring-2 ring-accent-400/50' : ''
      }`}
    >
      {tool.featured && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-accent-500 px-2.5 py-0.5 text-xs font-semibold text-white">
          Featured
        </span>
      )}
      <div
        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-md transition-transform group-hover:scale-110`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
      <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{tool.description}</p>
    </Link>
  )
}
