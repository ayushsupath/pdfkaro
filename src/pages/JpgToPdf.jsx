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
import { imagesToPdf } from '../utils/imageHelpers'
import { validateFile } from '../utils/pdfHelpers'

export default function JpgToPdf() {
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
      const err = validateFile(file, { types: ['image/jpeg', 'image/png', 'image/webp'] })
      if (err) {
        setError(err)
        toast.error(err)
        continue
      }
      valid.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      })
    }
    setItems((prev) => [...prev, ...valid])
  }, [])

  const removeItem = (id) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item?.preview) URL.revokeObjectURL(item.preview)
      return prev.filter((i) => i.id !== id)
    })
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

  const convert = async () => {
    if (!items.length) {
      toast.error('Please add at least one image')
      return
    }
    setProcessing(true)
    setProgress(0)
    try {
      const blob = await imagesToPdf(items, setProgress)
      saveAs(blob, 'pdfkaro-images.pdf')
      toast.success('PDF downloaded!')
    } catch (err) {
      toast.error(err.message || 'Conversion failed')
    } finally {
      setProcessing(false)
      setProgress(0)
    }
  }

  return (
    <ToolPageLayout
      title="JPG to PDF"
      description="Upload multiple images, reorder them, and combine into a single PDF."
    >
      <UploadZone
        onFiles={addFiles}
        accept="image/jpeg,image/png,image/webp"
        multiple
        label="Drop JPG or PNG images here"
        sublabel="Supports JPEG, PNG, and WebP"
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
                    preview={item.preview}
                    index={index}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            <Plus className="h-4 w-4" />
            Add more images
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(Array.from(e.target.files || []))
                e.target.value = ''
              }}
            />
          </label>

          {processing && <ProgressBar progress={progress} label="Creating PDF..." />}

          <button
            onClick={convert}
            disabled={processing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50 sm:w-auto"
          >
            <Download className="h-5 w-5" />
            {processing ? 'Converting...' : 'Download PDF'}
          </button>
        </>
      )}
    </ToolPageLayout>
  )
}
