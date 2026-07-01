import { useState, useCallback } from 'react'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { Download, Plus } from 'lucide-react'
import ToolPageLayout from '../components/shared/ToolPageLayout'
import UploadZone, { ErrorBanner } from '../components/shared/UploadZone'
import FileCard from '../components/shared/FileCard'
import ProgressBar from '../components/shared/ProgressBar'
import { mergePdfs } from '../utils/imageHelpers'
import { validateFile } from '../utils/pdfHelpers'

export default function MergePdf() {
  const [items, setItems] = useState([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const addFiles = useCallback((files) => {
    setError(null)
    const valid = []
    for (const file of files) {
      const err = validateFile(file, { types: ['application/pdf'] })
      if (err) {
        setError(err)
        toast.error(err)
        continue
      }
      valid.push({ id: crypto.randomUUID(), file })
    }
    setItems((prev) => [...prev, ...valid])
  }, [])

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const merge = async () => {
    if (items.length < 2) {
      toast.error('Add at least 2 PDF files to merge')
      return
    }
    setProcessing(true)
    setProgress(0)
    try {
      const blob = await mergePdfs(
        items.map((i) => i.file),
        setProgress
      )
      saveAs(blob, 'pdfkaro-merged.pdf')
      toast.success('Merged PDF downloaded!')
    } catch (err) {
      toast.error(err.message || 'Merge failed')
    } finally {
      setProcessing(false)
      setProgress(0)
    }
  }

  return (
    <ToolPageLayout
      title="Merge PDF"
      description="Combine multiple PDF files into one. Drag to reorder before merging."
    >
      <UploadZone
        onFiles={addFiles}
        accept="application/pdf"
        multiple
        label="Drop PDF files here"
        sublabel="Select 2 or more PDFs"
      />

      <ErrorBanner message={error} />

      {items.length > 0 && (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <FileCard
                    key={item.id}
                    id={item.id}
                    file={item.file}
                    index={index}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            <Plus className="h-4 w-4" />
            Add more PDFs
            <input
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(Array.from(e.target.files || []))
                e.target.value = ''
              }}
            />
          </label>

          {processing && <ProgressBar progress={progress} label="Merging PDFs..." />}

          <button
            onClick={merge}
            disabled={processing || items.length < 2}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50 sm:w-auto"
          >
            <Download className="h-5 w-5" />
            {processing ? 'Merging...' : 'Download Merged PDF'}
          </button>
        </>
      )}
    </ToolPageLayout>
  )
}
