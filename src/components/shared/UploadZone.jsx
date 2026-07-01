import { useCallback, useState } from 'react'
import { Upload, FileWarning } from 'lucide-react'

export default function UploadZone({
  onFiles,
  accept,
  multiple = false,
  maxFiles,
  label = 'Drag & drop files here',
  sublabel = 'or click to browse',
  icon: Icon = Upload,
}) {
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback(
    (fileList) => {
      if (!fileList?.length) return
      let files = Array.from(fileList)
      if (maxFiles) files = files.slice(0, maxFiles)
      onFiles(files)
    },
    [onFiles, maxFiles]
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 transition-all duration-200 ${
        dragOver
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
          : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-primary-600 dark:hover:bg-gray-800/50'
      }`}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <div
        className={`mb-4 rounded-full p-4 transition-colors ${
          dragOver ? 'bg-primary-100 dark:bg-primary-900/50' : 'bg-gray-100 dark:bg-gray-800'
        }`}
      >
        <Icon className={`h-8 w-8 ${dragOver ? 'text-primary-600' : 'text-gray-400'}`} />
      </div>
      <p className="text-base font-medium text-gray-700 dark:text-gray-200">{label}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{sublabel}</p>
    </label>
  )
}

export function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
      <FileWarning className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
      <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
    </div>
  )
}
