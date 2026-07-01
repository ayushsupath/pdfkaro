import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X, FileText, Image as ImageIcon } from 'lucide-react'
import { formatFileSize } from '../../utils/pdfHelpers'

export default function FileCard({ id, file, preview, onRemove, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isImage = file.type.startsWith('image/')
  const isPdf = file.type === 'application/pdf'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-gray-400 hover:text-gray-600 active:cursor-grabbing dark:hover:text-gray-300"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
        {index + 1}
      </span>

      {preview ? (
        <img src={preview} alt="" className="h-12 w-12 rounded-lg object-cover" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          {isImage ? (
            <ImageIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <FileText className="h-5 w-5 text-gray-400" />
          )}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
      </div>

      <button
        onClick={onRemove}
        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
        aria-label="Remove file"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
