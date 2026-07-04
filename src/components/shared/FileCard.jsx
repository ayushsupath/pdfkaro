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
      className="flex items-center gap-3 border border-border bg-black/70 p-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted hover:text-primary active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-border text-[10px] text-primary">
        {index + 1}
      </span>

      {preview ? (
        <div className="shrink-0 border border-border p-1">
          <img src={preview} alt="" className="h-12 w-12 object-cover" />
        </div>
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-black/40">
          {isImage ? <ImageIcon className="h-5 w-5 text-muted" /> : <FileText className="h-5 w-5 text-muted" />}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-primary">{file.name}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{formatFileSize(file.size)}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="border border-border px-2 py-1 text-[9px] uppercase tracking-[0.3em] text-primary">[OK]</span>
        <button
          onClick={onRemove}
          className="border border-border p-1.5 text-muted transition-colors hover:bg-error hover:text-background"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
