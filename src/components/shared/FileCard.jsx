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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-2xl border-2 border-black bg-ui p-3 shadow-hard-sm"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-brand-charcoal transition-colors hover:text-ink active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border-2 border-black bg-brand-sage text-[10px] font-bold text-ink">
        {index + 1}
      </span>

      {preview ? (
        <div className="shrink-0 rounded-sm border-2 border-black p-1">
          <img src={preview} alt="" className="h-12 w-12 object-cover" />
        </div>
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border-2 border-black bg-brand-charcoal/10">
          {isImage ? <ImageIcon className="h-5 w-5 text-brand-charcoal" /> : <FileText className="h-5 w-5 text-brand-charcoal" />}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{file.name}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-charcoal/70">{formatFileSize(file.size)}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded-sm border-2 border-black bg-brand-sage px-2 py-1 text-[9px] uppercase tracking-[0.3em] text-ink">[OK]</span>
        <button
          onClick={onRemove}
          className="rounded-md border-2 border-black bg-brand-yellow p-2 text-ink transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:bg-ink hover:text-ui"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
